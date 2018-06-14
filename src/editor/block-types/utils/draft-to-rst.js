import {convertToRaw} from 'draft-js';

import {Parser} from '../../../RST';

export default function draftToRST (editorState) {
	const currentContent = editorState && editorState.getCurrentContent();

	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent)) : '';
}
