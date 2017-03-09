import RSTParser from './rst-to-draft';
import DraftParser from './draft-to-rst';

export default {
	convertRSTToDraftState (rst, options) {
		const start = Date.now();
		console.log('Parsing RST of length: ', rst.length);
		const parsed = RSTParser.parse(rst, options);
		console.log('Took: ', Date.now() - start);

		return parsed;
	},


	convertDraftStateToRST (draftState, options) {
		const start = Date.now();
		console.log('Parsing Draft State of length: ', draftState.length);
		const parsed = DraftParser.parse(draftState, options);
		console.log('Took: ', Date.now() - start);

		return parsed;
	}
};
