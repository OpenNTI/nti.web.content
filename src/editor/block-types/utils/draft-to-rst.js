import {Parsers} from '@nti/web-editor';

import {Parser} from '../../../RST';

export default function draftToRST (editorState) {
	return editorState.getCurrentContent() ? Parser.convertDraftStateToRST(Parsers.Utils.getRawForState(editorState)) : '';
}
