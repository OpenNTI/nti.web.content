import {Parsers} from '@nti/web-editor';

import {Parser} from '../../../RST';

export default function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
		Parsers.Utils.getStateForRaw(draftState) :
		Parsers.Utils.getEmptyState();
}
