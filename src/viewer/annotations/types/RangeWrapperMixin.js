import * as DOM from '@nti/lib-dom';
import * as RangeUtils from '@nti/lib-ranges';
import Logger from '@nti/util-logger';

const logger = Logger.get('content:components:annotations:RangeWrapperMixin');

const wrap = 'content:RangeWrapperMixin:wrap';

const BEFORE = -1;
const SAME = 0;
const AFTER = 1;


function isInlineElement (node) {
	return {
		none: true,
		inline: true,
		'': true//??
		//Do not include "inline-(block|table)"
	}[getComputedStyle(node).display];
}

function isWidget (node) {
	return (node.hasAttribute && node.hasAttribute('data-reactid'))
		|| (node.tagName || '').toUpperCase() === 'WIDGET';
}


function canWrapNode (node) {
	return !isWidget(node);
}


function validToWrapEntireNode (node) {
	if (DOM.isTextNode(node)) {
		return true;
	}
	if (DOM.isElement(node)) {

		if (node.tagName === 'P') {
			return false;
		}

		if (node.childNodes.length === 0
			|| isWidget(node)
			|| isInlineElement(node)
			|| (
				(DOM.hasClass(node, 'mathjax') || DOM.hasClass(node, 'mathquill'))
				&& DOM.hasClass(node, 'link-button')
			)
		) {
			return true;
		}
	}

	return false;
}


export default {

	unwrap (node) {
		let {parentNode, ownerDocument} = node;

		if (node.firstChild) {
			let r = ownerDocument.createRange();
			r.selectNode(node);
			while (node.lastChild) {
				r.insertNode(node.lastChild);
			}
		}

		parentNode.removeChild(node);
		parentNode.normalize();
	},

	wrapRange (node, range) {
		let nodeList = [];
		let doc = node.ownerDocument;
		let nodeRange = doc.createRange();


		nodeRange.selectNodeContents(node);

		let startToStart = nodeRange.compareBoundaryPoints(Range.START_TO_START, range);
		let startToEnd = nodeRange.compareBoundaryPoints(Range.START_TO_END, range);

		let endToStart = nodeRange.compareBoundaryPoints(Range.END_TO_START, range);
		let endToEnd = nodeRange.compareBoundaryPoints(Range.END_TO_END, range);

		let valid = validToWrapEntireNode(node);

		//Easy case, the node is completely surronded and valid, wrap the node
		if (valid
			&& (startToStart === AFTER || startToStart === SAME)
			&& (endToEnd === BEFORE || endToEnd === SAME)) {

			if (canWrapNode(node)) {
				let newRange = doc.createRange();

				newRange.selectNode(node);

				nodeList.push(this[wrap](newRange));
			}
		}

		//If the node overlaps with the range in anyway we need to work on it's children
		else {

			for(let i of node.childNodes) {
				nodeList.push(...this.wrapRange(i, range));
			}

			if (DOM.isTextNode(node) || node.childNodes.length === 0) {
				let newRange = range;

				if (startToStart === BEFORE && (endToEnd === BEFORE || endToEnd === SAME)) {
					newRange = doc.createRange();
					newRange.setStart(range.startContainer, range.startOffset);
					newRange.setEndAfter(node);
				}
				else if (endToEnd === AFTER && (startToStart === AFTER || startToStart === SAME)) {
					newRange = doc.createRange();
					newRange.setStartBefore(node);
					newRange.setEnd(range.endContainer, range.endOffset);
				}


				if (newRange && startToEnd !== BEFORE && endToStart !== AFTER) {
					nodeList.push(this[wrap](newRange));
				}
			}
		}
		return nodeList.filter(x=>x);
	},


	[wrap] (range) {
		let {ownerDocument} = range.commonAncestorContainer;
		let rangeString = range.toString();
		let sc = range.startContainer;

		//This drops entire empty ranges, anything that wraps no text is thrown out.
		if (!rangeString || /^\s+$/.test(rangeString)) {
			return;
		}

		let span = this.createNonAnchorableSpan();

		if (sc && !DOM.isTextNode(sc) && sc === range.endContainer) {
			let first = RangeUtils.getSelectedNodes(range, ownerDocument)[0];
			let s = first && getComputedStyle(first).display;

			if (/block/i.test(s)) {
				span.style.display = s;
			}
		}

		try {
			range.surroundContents(span);
		} catch (e) {
			//InvalidStateError (trying to suround a range that spans to many branches)
			let known = e.code === 11 || e.name === 'InvalidStateError';

			//Its hard and costly to predict this, so we will just ignore it when it occurs and continue.

			if (!known) {
				logger.warn(e.stack || e.message || e);
			}
		}

		if (!span.firstChild) {
			DOM.removeNode(span);
			return;
		}


		// if (style !== 'suppressed') {
		// }

		return span;
	}

};
