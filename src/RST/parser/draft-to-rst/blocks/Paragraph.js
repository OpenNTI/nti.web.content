import {BLOCK_TYPE} from 'draft-js-utils';

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
		this.block = block;
	}


	getOutput () {
		return {output: this.block.text};
	}
}
