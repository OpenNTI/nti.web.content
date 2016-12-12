import {BLOCK_TYPE} from 'draft-js-utils';

import {getIndention} from '../utils';

function buildOrderedListItemRegex (itemRegex) {
	return new RegExp(`^\\s*(\\(?${itemRegex}\\.?\\)?)\\s(.*)`);
}

const TEXT = Symbol('text');
const INDENTION = Symbol('depth');
const BULLET = Symbol('bullet');
const ENTITY_RANGES = Symbol('entity ranges');
const INLINE_STYLE_RANGES = Symbol('inline style ranges');

const AUTO_NUMBERED = 'auto-numbered';
const NUMERIC = 'numeric';
const ALPHA_NUMERIC = 'alpha-numeric';
const ROMAN_NUMERAL = 'roman-numeral';

const REGEXS = {
	[AUTO_NUMBERED]: buildOrderedListItemRegex('#'),
	[NUMERIC]: buildOrderedListItemRegex('\\d+'),
	[ALPHA_NUMERIC]: buildOrderedListItemRegex('[a-z|A-Z]'),
	[ROMAN_NUMERAL]: buildOrderedListItemRegex('[MDCLXVI|mdclxvi]+')
};

const ORDER = [ROMAN_NUMERAL, ALPHA_NUMERIC, NUMERIC, AUTO_NUMBERED];


function parseBlock (block) {
	for (let listStyle of ORDER) {
		if (REGEXS[listStyle].test(block)) {
			return {
				listStyle,
				matches: block.match(REGEXS[listStyle])
			};
		}
	}
}

export default class OrderedListItem {
	static isTypeForBlock (block) {
		return REGEXS[AUTO_NUMBERED].test(block) ||
				REGEXS[NUMERIC].test(block) ||
				REGEXS[ALPHA_NUMERIC].test(block) ||
				REGEXS[ROMAN_NUMERAL].test(block);

	}

	static parse (block, context) {
		const {listStyle, matches} = parseBlock(block);
		const bullet = matches[1];
		const text = matches[2];
		const indention = getIndention(block, bullet);

		return {block: new this(text, listStyle, indention, bullet), context};
	}

	constructor (text, listStyle, indention, bullet) {
		this[TEXT] = text;
		this[INDENTION] = indention;
		this[BULLET] = bullet;
		this[ENTITY_RANGES] = [];
		this[INLINE_STYLE_RANGES] = [];
	}

	getOutput () {
		return {
			type: BLOCK_TYPE.ORDERED_LIST_ITEM,
			depth: this[INDENTION].blockOffset,
			text: this[TEXT],
			entityRanges: this[ENTITY_RANGES],
			inlineStyleRanges: this[INLINE_STYLE_RANGES]
		};
	}
}
