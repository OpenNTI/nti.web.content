import RSTParser from './rst-to-draft';
import DraftParser from './draft-to-rst';


export function convertRSTToDraftState (rst) {
	const start = Date.now();
	console.log('Parsing RST of length: ', rst.length);
	const parsed = RSTParser.parse(rst);
	console.log('Took: ', Date.now() - start);

	return parsed;
}

export function convertDraftStateToRST (draftState) {
	const start = Date.now();
	console.log('Parsing Draft State of length: ', draftState.length);
	const parsed = DraftParser.parse(draftState);
	console.log('Took: ', Date.now() - start);

	return parsed;
}
