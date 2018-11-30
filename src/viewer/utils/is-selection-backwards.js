export default function isSelectionBackwards (selection) {
	if (typeof document === 'undefined') { throw new Error('No document to create range to tell if selection is backwards'); }

	const range = document.createRange();

	range.setStart(selection.anchorNode, selection.anchorOffset);
	range.setEnd(selection.focusNode, selection.focusOffset);

	const isBackwards = range.collapsed;

	range.detach();

	return isBackwards;
}
