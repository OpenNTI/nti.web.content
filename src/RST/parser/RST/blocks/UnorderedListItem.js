import {BLOCK_TYPE} from 'draft-js-utils';

const TEXT = Symbol('Text');
const DEPTH = Symbol('Depth');
const ENTITY_RANGES = Symbol('Entity Ranges');
const INLINE_STYLE_RANGES = Symbol('Inline Style Ranges');

//Capture list items, the first capture group is the tabs
//to indicate depth the second is the text
const UNORDERED_LIST_ITEM = /^(\t*)-\s(.*)/;

export default class UnorderedListItem {
	static isTypeForBlock (block) {
		return UNORDERED_LIST_ITEM.test(block);
	}


	static parse (block, context) {
		const matches = block.match(UNORDERED_LIST_ITEM);
		const depth = matches[1].length;
		const text = matches[2];

		return {block: new this(text, depth), context};
	}


	constructor (text, depth) {
		//TODO: parse out the text and ranges
		this[TEXT] = text;
		this[DEPTH] = depth;
		this[ENTITY_RANGES] = [];
		this[INLINE_STYLE_RANGES] = [];
	}


	shouldAppendBlock (block) {
		//TODO: should append the block if its indented
		//the same amount as the text of the list item
		return block && block.isTextBlock;
	}


	appendBlock (block) {
		//TODO: fill this out
	}


	getOutput () {
		return {
			type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
			depth: this[DEPTH],
			text: this[TEXT],
			entityRanges: this[ENTITY_RANGES],
			inlineStyleRanges: this[INLINE_STYLE_RANGES]
		};
	}
}
