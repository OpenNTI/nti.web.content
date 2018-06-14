import {EditorState, convertFromRaw} from 'draft-js';

import {Parser} from '../../../RST';

export default function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
		EditorState.createWithContent(convertFromRaw(draftState)) :
		EditorState.createEmpty();
}
