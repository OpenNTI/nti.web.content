import {Flyout} from '@nti/web-commons';

const {TOP, BOTTOM, LEFT, CENTER, RIGHT, LEFT_OR_RIGHT} = Flyout.ALIGNMENTS;

const MENU_WIDTH = 200;

function sortRects (rects) {
	rects = Array.from(rects);

	return rects.sort((a, b) => {
		return a.top - b.top;
	});
}

function getTopRect (rects) {
	const sorted = sortRects(rects);

	return sorted[0];
}

function getBottomRect (rects) {
	const sorted = sortRects(rects);

	return sorted[sorted.length - 1];
}

function getHorizontalAlign (rect, x) {
	if (rect.width < MENU_WIDTH) {
		return LEFT_OR_RIGHT;
	}

	const split = rect.width / 3;

	if (x < rect.left + split) { return LEFT; }
	if (x < rect.left + (split * 2)) { return CENTER; }

	return RIGHT;
}

function getParentNode (node) {
	while (node && !node.getBoundingClientRect) {
		node = node.parentNode;
	}

	return node;
}


function getAlignTo (rect, node) {
	const parent = getParentNode(node);

	if (!parent) { return null; }

	const parentRect = parent.getBoundingClientRect();

	return {
		getBoundingClientRect: () => rect,
		offsetParent: parent,
		parentNode: parent,
		offsetWidth: rect.width,
		offsetHeight: rect.height,
		offsetTop: rect.top - parentRect.top,
		offsetLeft: rect.left - parentRect.left,
		scrollTop: 0,
		scrollLeft: 0
	};
}

export default function getAlignment (userSelection) {
	const {range, event} = userSelection || {};

	if (!range || !event) { return; }

	const boundingRect = range.getBoundingClientRect();
	const clientRects = range.getClientRects();
	const {clientX, clientY} = event;

	const boundingRectMiddle = boundingRect.top + (boundingRect.height / 2);
	const verticalAlign = boundingRectMiddle >= clientY && clientRects.length > 1 ? TOP : BOTTOM;

	const alignToRect = verticalAlign === TOP ? getTopRect(clientRects) : getBottomRect(clientRects);
	const node = verticalAlign === TOP ? range.startContainer : range.endContainer;

	const alignTo = getAlignTo(alignToRect, node);

	if (!alignTo) { return; }

	return {
		alignTo,
		verticalAlign,
		horizontalAlign: getHorizontalAlign(alignToRect, clientX)
	};
}
