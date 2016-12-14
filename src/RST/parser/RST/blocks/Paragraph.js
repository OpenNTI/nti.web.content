import {BLOCK_TYPE} from 'draft-js-utils';

import TextParser from '../text-parser';

import IndentedBlock from './IndentedBlock';

const PARAGRAPH_REGEX = /^\s*(.*)/;

export default class Paragraph extends IndentedBlock {
	static isTypeForBlock (block) {
		return PARAGRAPH_REGEX.test(block);
	}

	static parse (block, context) {
		const matches = block.match(PARAGRAPH_REGEX);
		const text = matches[1];

		return {block: new this(block, '', {text}), context};
	}


	isParagraph = true


	getOutput (context) {
		const {text} = this.parts;
		const parsedText = TextParser.parse(text);

		//TODO: if we are depth 1 turn it into a block quote

		const output = {
			depth: 0,
			type: BLOCK_TYPE.UNSTYLED,
			entityRanges: parsedText.entityRanges,
			inlineStyleRanges: parsedText.inlineStyleRanges,
			text: parsedText.text
		};

		//TODO: merge the entityMap from parsing the text
		//with the entityMap in the context
		return {output, context};
	}
}
