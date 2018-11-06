import {matches, isTextNode} from '@nti/lib-dom';
import {makeRangeAnchorable} from '@nti/lib-anchors';


import {getRange} from './range-strategies';

const SPECIAL_CASES = [
	'object[type$=naquestion]',
	'object[type$=ntivideo]'
];

function findParentOrSelfMatchingSelector (node, selector, container) {
	const limit = container.parentNode;
	let active = node;

	while (active && active !== limit) {
		if (matches(active, selector)) { return active; }

		active = active.parentNode;
	}

	return null;
}

function getLineForSpecialCases (range, container) {
	const ancestor = range.commonAncestorContainer;

	if (!ancestor) { return null; }

	for (let specialCase of SPECIAL_CASES) {
		const node = findParentOrSelfMatchingSelector(ancestor, specialCase, container);

		if (!node) { continue; }

		const specialRange = container.ownerDocument.createRange();

		specialRange.selectNodeContents(node);
		return {rect: range.getBoundingClientRect(), range: specialRange};
	}
}

function getAnchorableRange (range, container) {
	try {
		const ancestor = range.commonAncestorContainer;

		//ranges created next to videos sometimes require massaging
		//to be anchors, do that now.
		if (!isTextNode(ancestor) && ancestor.classList.contains('externalvideo')) {
			range.setStartBefore(range.startContainer);
			range.setEndAfter(range.endContainer);
		}
		//Note this is being abused here. Just because this returns null doesn't mean we can't anchor the range.
		//Case in point for ranges within a question we can always anchor them, but this may return null. The correct thing
		//to do is actually call createDomContentPointer and see if it returns something, but that will have performance implications
		//so we need to figure something else out
		range = makeRangeAnchorable(range, container.ownerDocument);
	} catch (e) {
		range = null;
	}

	return range;
}

function getObjectRange (node, container) {
	const objectNode = findParentOrSelfMatchingSelector(node, 'object', container);

	if (!objectNode) { return null; }

	const objectRange = container.ownerDocument.createRange();

	objectRange.selectNodeContents(objectNode);

	return getAnchorableRange(objectRange, container);
}

/**
 * Given a y screen position and a container, find a range
 * and a rect for that line in the container.
 *
 * @param  {Number} yCoordinate          y screen coordinate
 * @param  {Element} container dom node to find range in, defaults to the whole document
 * @return {Object|null}       the range and rect found, or null.
 */
export default function findLineInContainer (yCoordinate, container) {
	//if we don't have a document we can't find a line so don't
	//even try
	if (!container || !container.ownerDocument) { return null; }

	const y = Math.round(yCoordinate);
	let range = getRange(y, container);

	//check for special cases
	if (range) {
		const specialCase = getLineForSpecialCases(range, container);

		if (specialCase) {
			return specialCase;
		}
	}

	let ancestor = range && range.commonAncestorContainer;
	range = getAnchorableRange(range, container);

	//If we have no range but we do have an ancestor that's an object,
	//let's use that to create the anchorable range.
	if (!range && ancestor) {
		range = getObjectRange(ancestor, container);
	}

	return range ? {rect: range.getBoundingClientRect(), range} : null;
}
