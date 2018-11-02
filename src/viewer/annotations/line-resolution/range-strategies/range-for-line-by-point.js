export default {
	shouldUse: () => typeof document !== 'undefined' && document.caretRangeFromPoint,

	computeRange: (y, container) => {
		const doc = container.ownerDocument;

		const page = container.querySelector('.page-contents');
		const rect = page && page.getBoundingClientRect();
		const xStart = rect ? rect.left : 0;
		const xEnd = rect && (rect.left + rect.width);
		const range = doc.caretRangeFromPoint(xStart, y);
		const rangeEnd = doc.caretRangeFromPoint(xEnd, y);

		if (!range) { return null; }

		//If we managed to grab an end, use it to expand the range,
		//otherwise just stick with the first word...
		if (rangeEnd) {
			range.setEnd(rangeEnd.endContainer, rangeEnd.endOffset);
		} else {
			range.expand('word');
		}

		//If we have a selected range that is still collapsed. No anchor
		if (range.collapsed) {
			return null;
		}

		getSelection().removeAllRanges();
		getSelection().addRange(range);

		return range;
	}
};
