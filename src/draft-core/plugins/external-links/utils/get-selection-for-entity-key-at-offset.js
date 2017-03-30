import {SelectionState} from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import getRangesForDraftEntity from 'draft-js/lib/getRangesForDraftEntity';


function getRangeForBlock (block, entityKey) {
	const ranges = getRangesForDraftEntity(block, entityKey);

	//TODO: look into how we need handle more than one range for the
	//for a given entity

	return ranges[0];
}


function getStartOfSelection (range, block, entityKey, content) {
	const start = {key: block.key, offset: range.start};

	if (range.start !== 0) {
		return start;
	}

	const prevBlock = content.getBlockBefore(block.key);
	const prevRange = prevBlock && getRangeForBlock(prevBlock, entityKey);

	if (prevRange && prevRange.end === (prevBlock.text.length - 1)) {
		return getStartOfSelection(prevRange, prevBlock, entityKey, content);
	}

	return start;
}


function getEndOfSelection (range, block, entityKey, content) {
	const end = {key: block.key, offset: range.end};

	if (range.end !== (block.text.length - 1)) {
		return end;
	}

	const nextBlock = content.getBlockAfter(block.key);
	const nextRange = nextBlock && getRangeForBlock(nextBlock, entityKey);

	if (nextRange && nextRange.start === 0) {
		return getEndOfSelection(nextRange, nextBlock, entityKey, content);
	}

	return end;
}


export default function getSelectionForEntityKeyAtOffset (entityKey, offsetKey, editorState) {
	const {blockKey} = DraftOffsetKey.decode(offsetKey);
	const content = editorState.getCurrentContent();
	const selection = editorState.getSelection();
	const block = content.getBlockForKey(blockKey);
	const range = getRangeForBlock(block, entityKey);

	const start = getStartOfSelection(range, block, entityKey, content);
	const end = getEndOfSelection(range, block, entityKey, content);

	return new SelectionState({
		anchorKey: start.key,
		anchorOffset: start.offset,
		focusKey: end.key,
		focusOffset: end.offset,
		isBackward: false,
		hasFocus: selection.getHasFocus()
	});
}
