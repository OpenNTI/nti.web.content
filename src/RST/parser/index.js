import RSTParser from './rst-to-draft';
import DraftParser from './draft-to-rst';

export default class Parser {
	static convertRSTToDraftState (rst, options) {
		return RSTParser.parse(rst, options);
	}


	static convertDraftStateToRST (draftState, options) {
		return DraftParser.parse(draftState, options);
	}
}
