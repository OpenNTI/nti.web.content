import {BLOCK_TYPE} from 'draft-js-utils';

import {getDocIDStringFor} from '../utils';
import parseText from '../text-parser';

const BLOCK = Symbol('Block');

export default class Paragraph {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return input.type === BLOCK_TYPE.UNSTYLED || input.type === BLOCK_TYPE.BLOCK_QUOTE;
	}

	static parse (inputInterface) {
		const input = inputInterface.get(0);

		return {block: new this(input)};
	}

	followWithBlankLine = true

	constructor (block) {
		this[BLOCK] = block;
	}


	getOutput (context) {
		return {output: [getDocIDStringFor(this[BLOCK]), parseText(this[BLOCK], context)]};
	}
}
