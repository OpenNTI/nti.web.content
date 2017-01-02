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

	constructor (...args) {
		super(...args);

		this.lineCount = 1;
	}


	isParagraph = true

	get text () {
		return this.parts.text;
	}

	get isOneLine () {
		return this.lineCount === 1;
	}

	//TODO: if the next block is not white space, and is indented its a term not a paragraph
	shouldAppendBlock (block) {
		return block && block.isParagraph && this.isSameOffset(block);
	}


	appendBlock (block) {
		this.lineCount += 1;
		this.parts.text.append(block.text);

		return {block: this};
	}


	getOutput (context) {
		const {text} = this;
		const {output, context:newContext} = text.getOutput(context);
		const type = this.depth === 0 ? BLOCK_TYPE.UNSTYLED : BLOCK_TYPE.BLOCKQUOTE;

		return {output: {...output, depth: 0, type}, newContext};
	}
}
