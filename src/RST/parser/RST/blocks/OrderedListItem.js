import {BLOCK_TYPE} from 'draft-js-utils';

import UnorderedListItem from './UnorderedListItem';

const AUTO_NUMBERED = 'auto-numbered';
const NUMERIC = 'numeric';
const ALPHA_NUMERIC = 'alpha-numeric';
const ROMAN_NUMERAL = 'roman-numeral';

function buildOrderedListItemRegex (itemRegex) {
	return new RegExp(`^\\s*(\\(?${itemRegex}\\.?\\)?)\\s(.*)`);
}

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

export default class OrderedListItem extends UnorderedListItem {
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

		return {block: new this(block, bullet, {text, listStyle, bullet}), context};
	}


	getOutput (context) {
		const {text, listStyle} = this.parts;
		const output = {
			data: {listStyle},
			type: BLOCK_TYPE.ORDERED_LIST_ITEM,
			depth: this.depth,
			text: text,
			entityRanges: [],
			inlineStyleRanges: []
		};

		return {output, context};
	}
}
