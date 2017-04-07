import {SelectionState} from 'draft-js';

import createLinkAtSelection from './create-link-at-selection';
import getSelectionForEntityKeyAtOffset from './get-selection-for-entity-key-at-offset';


function createSelectionForBlock (block, start, end) {
	start = start || 0;
	end = end || block.text.length;

	return new SelectionState({
		anchorKey: block.key,
		anchorOffset: start,
		focusKey: block.key,
		focusOffset: end,
		isBackward: false,
		hasFocus: false
	});
}

export default function createNewLinkAtOffset (link, text, entityKey, offsetKey, editorState) {
	const selection = getSelectionForEntityKeyAtOffset(entityKey, offsetKey, editorState);
	const start = selection.getStartKey();
	const end = selection.getEndKey();

	if (start === end) {
		return createLinkAtSelection(link, text, editorState, selection);
	}

	const content = editorState.getCurrentContent();

	let newState = createLinkAtSelection(link, void 0, editorState, createSelectionForBlock(content.getBlockForKey(start), selection.getStartOffset()));

	let nextBlock = content.getBlockAfter(start);

	while (nextBlock.key !== end) {
		newState = createLinkAtSelection(link, void 0, newState, createSelectionForBlock(nextBlock));
		nextBlock = content.getBlockAfter(nextBlock.key);
	}

	newState = createLinkAtSelection(link, void 0, newState, createSelectionForBlock(content.getBlockForKey(end), 0, selection.getEndOffset()));

	return newState;
}
