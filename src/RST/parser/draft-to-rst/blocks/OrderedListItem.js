import {BLOCK_TYPE} from 'draft-js-utils';

import UnorderedListItem, {getIndentForDepth} from './UnorderedListItem';


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

//TODO: import these constants from either the ordered list item in the rst parser
//or a shared place that both pull from
const STYLE_TO_ORDINAL = {
	'numeric': ordinal => ordinal,
	'auto-numbered': ordinal => ordinal,
	'alpha-numeric': ordinal => toAlphaNumeric(ordinal),
	'roman-numeral': ordinal => toRomanNumeral(ordinal)
};

export default class OrderedListItem extends UnorderedListItem {
	static isNextBlock (inputInterface) {
		const input = inputInterface.getInput(0);

		return input.type === BLOCK_TYPE.ORDERED_LIST_ITEM;
	}

	shouldAppendBlock (block) {
		return block.type === BLOCK_TYPE.ORDERED_LIST_ITEM;
	}

	getOutput () {
		const {blocks} = this;
		let output = [];
		let currentDepth = 0;
		let ordinals = {};

		for (let block of blocks) {
			let {depth, text, data:{listStyle}} = block;
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

			output.push(`${indent}${bullet}. ${text}`);
		}

		return {output};
	}
}
