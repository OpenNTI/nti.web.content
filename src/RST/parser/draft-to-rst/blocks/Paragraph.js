import {BLOCK_TYPE} from 'draft-js-utils';

const BLOCK = Symbol('Block');

export default class Paragraph {
	static isNextBlock (inputInterface) {
		const input = inputInterface.getInput(0);

		return input.type === BLOCK_TYPE.UNSTYLED || input.type === BLOCK_TYPE.BLOCK_QUOTE;
	}

	static parse (inputInterface) {
		const input = inputInterface.getInput(0);

		return {block: new this(input)};
	}

	followWithBlankLine = true

	constructor (block) {
		this[BLOCK] = block;
	}


	getOutput () {
		return {output: this[BLOCK].text};
	}
}
