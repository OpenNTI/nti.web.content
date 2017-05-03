import {Modifier, EditorState} from 'draft-js';

import {getRangeForBlock} from '../../../utils';
import {CHANGE_TYPES} from '../../../Constants';

export default function setBlockData (block, data, editorState) {
	const content = editorState.getCurrentContent();
	const selection = getRangeForBlock(block);

	const newContent = Modifier.setBlockData(content, selection, data);

	return EditorState.push(editorState, newContent, CHANGE_TYPES.CHANGE_BLOCK_DATA);
}
