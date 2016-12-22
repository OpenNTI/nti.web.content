import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';
import Text from './Text';

const PARAGRAPH_REGEX = /^\s*(.*)/;

export default class Paragraph extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const input = inputInterface.getInput();

		return PARAGRAPH_REGEX.test(input);
	}

	static parse (inputInterface, context) {
		const input = inputInterface.getInput();
		const matches = input.match(PARAGRAPH_REGEX);
		const text = matches[1];

		return {block: new this(input, '', {text: new Text(text)}), context};
	}


	isParagraph = true

	get text () {
		return this.parts.text;
	}


	shouldAppendBlock (block) {
		return block && block.isParagraph && this.isSameOffset(block);
	}


	appendBlock (block) {
		this.parts.text.append(block.text);

		return {block: this};
	}


	getOutput (context) {
		const {text} = this;
		const {output, context:newContext} = text.getOutput(context);

		return {output: {...output, depth: 0, type: BLOCK_TYPE.UNSTYLED}, newContext};
	}
}
