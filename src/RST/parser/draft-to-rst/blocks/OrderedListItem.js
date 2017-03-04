import {BLOCK_TYPE} from 'draft-js-utils';

// import {getUIDStringFor} from '../utils';
import parseText from '../text-parser';
import {LIST_STYLES} from '../../Constants';

import UnorderedListItem, {getIndentForDepth} from './UnorderedListItem';

const {AUTO_NUMBERED, NUMERIC, ALPHA_NUMERIC, ROMAN_NUMERAL} = LIST_STYLES;


//from: http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
export function toRomanNumeral (num) {
	const digits = String(+num).split('');
	const key = [
		'', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
		'', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
		'', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
	];

	let roman = '';
	let i = 3;
	let m = [];

	while (i--) {
		roman = (key[+digits.pop() + (i * 10)] || '') + roman;
	}

	m.length = +digits.join('') + 1;

	return m.join('M') + roman;
}

export function toAlphaNumeric (num) {
	const val = (num - 1) % 26;
	const letter = String.fromCharCode(97 + val);
	const num2 = Math.floor((num - 1) / 26);

	if (num2 > 0) {
		return this.toBase26SansNumbers(num2) + letter;
	}

	return letter;
}

const STYLE_TO_ORDINAL = {
	[AUTO_NUMBERED]: ordinal => ordinal,
	[NUMERIC]: ordinal => ordinal,
	[ALPHA_NUMERIC]: ordinal => toAlphaNumeric(ordinal),
	[ROMAN_NUMERAL]: ordinal => toRomanNumeral(ordinal)
};

export default class OrderedListItem extends UnorderedListItem {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return input.type === BLOCK_TYPE.ORDERED_LIST_ITEM;
	}

	shouldAppendBlock (block) {
		return block.type === BLOCK_TYPE.ORDERED_LIST_ITEM;
	}

	getOutput (context) {
		const {blocks} = this;
		let output = [];
		let currentDepth = 0;
		let ordinals = {};

		for (let block of blocks) {
			let {depth, data:{listStyle}} = block;
			let text = parseText(block, context);
			let ordinal = ordinals[depth] ? ordinals[depth] + 1 : 1;
			let indent = getIndentForDepth(depth);
			let bullet = STYLE_TO_ORDINAL[listStyle || 'numeric'](ordinal);

			ordinals[depth] = ordinal;

			if (depth < currentDepth) {
				ordinals[currentDepth] = 0;
			}

			if (depth !== currentDepth) {
				output.push('');
			}

			currentDepth = depth;

			// output.push(getUIDStringFor(block));
			output.push(`${indent}${bullet}. ${text}`);
		}

		return {output};
	}
}
