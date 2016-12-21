import RSTParser from './RST';


export function convertRSTToDraftState (rst) {
	return RSTParser.parse(rst);
}
