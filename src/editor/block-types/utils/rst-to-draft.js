import {Parsers as EditorParsers} from '@nti/web-editor';
import {Parsers as ReadingParsers} from '@nti/web-reading';

export default function rstToDraft (rst) {
	const draftState = rst && ReadingParsers.RST.toRawDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
		EditorParsers.Utils.getStateForRaw(draftState) :
		EditorParsers.Utils.getEmptyState();
}
