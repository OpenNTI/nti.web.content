import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';

//Capture list items
const UNORDERED_LIST_ITEM = /^\s*-\s(.*)/;

export default class UnorderedListItem extends IndentedBlock {
	static isTypeForBlock (block) {
		return UNORDERED_LIST_ITEM.test(block);
	}


	static parse (block, context) {
		const matches = block.match(UNORDERED_LIST_ITEM);
		const text = matches[1];

		return {block: new this(block, '-', {text}), context};
	}

	shouldAppendBlock (block) {
		//TODO: should append the block it ts a paragraph and its offset
		//the same amount as the text of the list item
		return block && block.isTextBlock;
	}


	appendBlock (block) {
		//TODO: fill this out
	}


	toDraft () {
		const {text} = this.parts;

		return {
			type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
			depth: this.depth,
			text: text,
			entityRanges: [],
			inlineStyleRanges: []
		};
	}
}
