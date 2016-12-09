import RSTParser from './RST';


export function convertRSTToDraftState (rst) {
	const parser = new RSTParser();

	return parser.parse(rst);
}
