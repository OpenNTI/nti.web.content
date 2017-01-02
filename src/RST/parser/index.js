import RSTParser from './rst-to-draft';


export function convertRSTToDraftState (rst) {
	return RSTParser.parse(rst);
}
