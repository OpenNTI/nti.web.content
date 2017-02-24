import {BLOCK_TYPE} from 'draft-js-utils';

import {LIST_STYLES} from '../../Constants';

import UnorderedListItem from './UnorderedListItem';
import Text from './Text';

const {AUTO_NUMBERED, NUMERIC, ALPHA_NUMERIC, ROMAN_NUMERAL} = LIST_STYLES;

//Since the regex only matches space before the bullet it should account for
//escaping ordered list items by saying they don't match a ordered list
function buildOrderedListItemRegex (itemRegex) {
	//^\s*(\(?{itemRegex}(\.|\)))\s*(.*)
	return new RegExp(`^\\s*(\\(?(${itemRegex})(?:\\.|\\)))\\s*(.*)`);
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
			let matches = block.match(REGEXS[listStyle]);

			return {
				listStyle,
				bullet: matches[1],
				ordinal: matches[2],
				text: matches[3]
			};
		}
	}
}

/**
 * This method is meant to take care of the ambiguous cases between roman numerals and
 * alpha numeric. According to the docs, roman numeral lists must start with I, i, or a double
 * digit roman numeral. If we get a single digit roman numeral that isn't i or I, we look back
 * to find the previous list item at the same depth. If we hit a non ordered list item or hit a
 * list item that is not roman numeral, we switch to alpha numeric.
 *
 * Likewise alpha numeric lists can not start with I or i, but that is taken care of by checking
 * if its a roman numeral first.
 *
 * http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#enumerated-lists
 *
 * @param  {Object} block           the ordered list item
 * @param  {Object} parsedInterface the already parsed blocks
 * @return {Object}                 the block with the correct list style
 */
function maybeSwitchStyle (block, parsedInterface) {
	const {listStyle, ordinal, depth} = block;

	if (listStyle !== ROMAN_NUMERAL || ordinal.length > 1 || ordinal === 'i' || ordinal === 'I') { return block; }

	let lookBack = 0;
	let previousBlock = parsedInterface.get(lookBack);
	let previousListItem = null;

	while (!previousListItem) {
		if (previousBlock.isOrderedListItem && previousBlock.depth === depth) {
			previousListItem = previousBlock;
		} else if (!previousBlock.isOrderedListItem && !previousBlock.isEmpty) {
			break;
		}

		lookBack -= 1;
		previousBlock = parsedInterface.get(lookBack);
	}

	if (!previousListItem || previousListItem.listStyle !== ROMAN_NUMERAL) {
		block.listStyle = ALPHA_NUMERIC;
	}

	return block;
}

export default class OrderedListItem extends UnorderedListItem {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get();

		return REGEXS[AUTO_NUMBERED].test(input) ||
				REGEXS[NUMERIC].test(input) ||
				REGEXS[ALPHA_NUMERIC].test(input) ||
				REGEXS[ROMAN_NUMERAL].test(input);

	}

	static parse (inputInterface, context, parsedInterface) {
		const input = inputInterface.get();
		const {listStyle, bullet, ordinal, text} = parseBlock(input);
		let block = new this(input, bullet, {text: new Text(text), listStyle, bullet, ordinal});

		block = maybeSwitchStyle(block, parsedInterface);

		return {block, context};
	}

	isOrderedListItem = true

	get text () {
		return this.parts.text;
	}


	get listStyle () {
		return this.parts.listStyle;
	}


	set listStyle (style) {
		this.parts.listStyle = style;
	}


	get ordinal () {
		return this.parts.ordinal;
	}


	get bullet () {
		return this.parts.bullet;
	}


	shouldAppendBlock (block) {
		return block && block.isParagraph && this.isSameOffset(block);
	}


	appendBlock (block) {
		this.parts.text.append(block.text);

		return {block: this};
	}


	getOutput (context) {
		const {text, listStyle} = this;
		const {output, context:newContext} = text.getOutput(context);

		return {output: {...output, depth: this.depth, type: BLOCK_TYPE.ORDERED_LIST_ITEM, data: {...this.blockData, listStyle}}, newContext};
	}
}
