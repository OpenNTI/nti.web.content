import RSTParser from './rst-to-draft';


export function convertRSTToDraftState (rst) {
	const start = Date.now();
	console.log('Parsing RST of length: ', rst.length);
	const parsed = RSTParser.parse(rst);
	console.log('Took: ', Date.now() - start);

	return parsed;
}
