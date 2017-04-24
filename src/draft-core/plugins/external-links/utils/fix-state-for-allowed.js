import {EditorState, Modifier, SelectionState} from 'draft-js';

function getRangeForBlock (block) {
	const key = block.getKey();

	return new SelectionState({
		anchorKey: key,
		anchorOffset: 0,
		focusKey: key,
		focusOffset: block.getLength()
	});
}


function removeLinkFromBlock (block, content) {
	return Modifier.applyEntity(content, getRangeForBlock(block), null);
}


export default function fixStateForAllowed (editorState, allowedSet) {
	if (!allowedSet) { return editorState; }

	let content = editorState.getCurrentContent();
	const originalContent = content;

	for (let block of content.getBlocksAsArray()) {
		if (!allowedSet.has(block.type)) {
			content = removeLinkFromBlock(block, content);
		}
	}

	if (content === originalContent) { return editorState; }

	return EditorState.create({
		currentContent: content,
		allowUndo: editorState.getAllowUndo(),
		decorator: editorState.getDecorator(),
		selection: editorState.getSelection()
	});
}
