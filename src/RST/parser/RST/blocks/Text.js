import {BLOCK_TYPE} from 'draft-js-utils';

const TEXT = Symbol('Text');
const ENTITY_RANGES = Symbol('Entity Ranges');
const INLINE_STYLE_RANGES = Symbol('Inline Style Ranges');
const IS_CONSUMED = Symbol('Is Consumed');

const WHITE_SPACE_ONLY = /^\s+$/;

export default class Text {
	static isTypeForBlock (block) {
		return !WHITE_SPACE_ONLY.test(block);
	}

	static parse (block, context) {
		return {block: new this(block), context};
	}

	isTextBlock = true

	constructor (block) {
		//TODO: parse out the parts of the text
		this[TEXT] = block;
		this[ENTITY_RANGES] = [];
		this[INLINE_STYLE_RANGES] = [];
	}

	get text () {
		return this[TEXT];
	}

	consume () {
		this[IS_CONSUMED] = true;
	}


	getOutput (context, force) {
		if (this[IS_CONSUMED] && !force) { return null; }

		return {
			depth: 0,
			type: BLOCK_TYPE.UNSTYLED,
			entityRanges: this[ENTITY_RANGES],
			inlineStyleRanges: this[INLINE_STYLE_RANGES],
			text: this[TEXT]
		};
	}
}
