import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';

const PARAGRAPH_REGEX = /^\s*(.*)/;

export default class Text extends IndentedBlock {
	static isTypeForBlock (block) {
		return PARAGRAPH_REGEX.test(block);
	}

	static parse (block, context) {
		const matches = block.match(PARAGRAPH_REGEX);
		const text = matches[1];

		return {block: new this(block, '', {text}), context};
	}


	isTextBlock = true


	toDraft (/*context*/) {
		const {text} = this.parts;

		//TODO: if we are depth 1 turn it into a block quote

		return {
			depth: 0,
			type: BLOCK_TYPE.UNSTYLED,
			entityRanges: [],
			inlineStyleRanges: [],
			text: text
		};
	}
}
