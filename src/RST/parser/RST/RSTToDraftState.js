import Parser from '../Parser';

import blocks from './blocks';

export default class RSTToDraftState extends Parser {

	getBlockTypes () {
		return blocks;
	}


	formatInput (input) {
		return input.split('\n');
	}
}
