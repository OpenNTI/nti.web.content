import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';

//Capture list items
const UNORDERED_LIST_ITEM = /^\s*-\s(.*)/;

export default class UnorderedListItem extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const input = inputInterface.getInput();

		return UNORDERED_LIST_ITEM.test(input);
	}


	static parse (inputInterface, context) {
		const input = inputInterface.getInput();
		const matches = input.match(UNORDERED_LIST_ITEM);
		const text = matches[1];

		return {block: new this(input, '-', {text}), context};
	}


	shouldAppendBlock (block) {
		//TODO: should append the block it ts a paragraph and its offset
		//the same amount as the text of the list item
		return block && block.isParagraph;
	}


	appendBlock (/*block*/) {
		//TODO: fill this out
	}


	getOutput (context) {
		const {text} = this.parts;
		const output = {
			type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
			depth: this.depth,
			text: text,
			entityRanges: [],
			inlineStyleRanges: []
		};

		return {output, context};
	}
}
