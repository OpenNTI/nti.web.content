import {Modifier, EditorState} from 'draft-js';

import getSelectionForEntityKeyAtOffset from './get-selection-for-entity-key-at-offset';

export default function replaceEntityTextAtOffset (text, entityKey, offset, editorState) {
	const selection = getSelectionForEntityKeyAtOffset(entityKey, offset, editorState);
	const content = editorState.getCurrentContent();
	const newContent = Modifier.replaceText(content, selection, text, void 0, entityKey);

	return EditorState.create({
		currentContent: newContent,
		allowUndo: editorState.getAllowUndo(),
		decorator: editorState.getDecorator(),
		selection
	});
}
