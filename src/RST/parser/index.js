import RSTParser from './rst-to-draft';
import DraftParser from './draft-to-rst';

const testFigure = [
	'.. course-figure:: https://placebear.com/200/300',
	'   :scale: 50 %',
	'   :alt: Test Bear',
	'',
	'   Test Course Figure',
	'',
	'   Bankai second form'
].join('\n');

export default class Parser {
	static convertRSTToDraftState (rst, options) {
		//TODO: REMOVE THIS!!!!
		rst = `${rst}\n\n${testFigure}`;

		return RSTParser.parse(rst, options);
	}


	static convertDraftStateToRST (draftState, options) {
		return DraftParser.parse(draftState, options);
	}
}
