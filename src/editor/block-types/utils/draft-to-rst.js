import {Parsers} from '@nti/web-editor';
import {Parsers as ReadingParsers} from '@nti/web-reading';

const Parser = ReadingParsers.RST;

export default function draftToRST (editorState) {
	return editorState.getCurrentContent() ? Parser.convertDraftStateToRST(Parsers.Utils.getRawForState(editorState)) : '';
}
