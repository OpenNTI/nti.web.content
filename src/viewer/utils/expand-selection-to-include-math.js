import {isTextNode, matches} from '@nti/lib-dom';

//Taken from nti.web.app/src/main/js/legacy/util/Anchors#expandSelectionToIncludeMath

function isMathNode (node) {
	return node && !isTextNode(node) && matches(node, '.math');
}

function getMathParent (node) {
	//if the node is a math node it doesn't have a math parent
	if (!node || isMathNode(node)) { return null; }

	const parent = node.parentNode;

	if (isMathNode(parent)) { return parent; }

	return getMathParent(parent);
}

function expandRangeToIncludeMath (range) {
	if (!range) { return null; }

	const startMathParent = getMathParent(range.startContainer);
	const endMathParent = getMathParent(range.endContainer);

	if (startMathParent) {
		range.setStartBefore(startMathParent);
	}

	if (endMathParent) {
		range.setEndAfter(endMathParent);
	}
}

export default function expandSelectionToIncludeMath (selection) {
	const range = selection.rangeCount ? selection.getRangeAt(0) : null;

	if (!range) { return selection; }

	selection.removeAllRanges();
	expandRangeToIncludeMath(range);
	selection.addRange(range);

	return selection;
}
