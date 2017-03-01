import {BLOCK_TYPE} from 'draft-js-utils';

import {getUIDStringFor} from '../utils';
import parseText from '../text-parser';

const BLOCK = Symbol('Block');

export const TYPE_TO_LEVEL = {
	[BLOCK_TYPE.HEADER_ONE]: 1,
	[BLOCK_TYPE.HEADER_TWO]: 2,
	[BLOCK_TYPE.HEADER_THREE]: 3,
	[BLOCK_TYPE.HEADER_FOUR]: 4,
	[BLOCK_TYPE.HEADER_FIVE]: 5,
	[BLOCK_TYPE.HEADER_SIX]: 6
};

const LEVEL_TO_CHAR = {
	1: '=',
	2: '*',
	3: '-',
	4: '.',
	5: '#',
	6: '"'
};

const LEVEL_TO_INDENT = {
	1: ' ',
	2: '',
	3: '',
	4: '',
	5: '',
	6: ''
};

function buildStringForChar (char, length) {
	return Array(length + 1).join(char);
}

export default class Header {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return !!TYPE_TO_LEVEL[input.type];
	}

	static parse (inputInterface) {
		const input = inputInterface.get(0);

		return {block: new this(input)};
	}

	followWithBlankLine = true

	constructor (block) {
		this[BLOCK] = block;
	}

	get depth () {
		return TYPE_TO_LEVEL[this[BLOCK].type];
	}

	get isTitle () {
		return this.depth === 1;
	}

	getOutput (context) {
		const {depth, isTitle} = this;
		const text = parseText(this[BLOCK], context);
		const lineLength = isTitle ? text.length + 2 : text.length;
		const char = LEVEL_TO_CHAR[depth];
		const indent = LEVEL_TO_INDENT[depth];

		let output = [];

		if (isTitle) {
			output.push(buildStringForChar(char, lineLength));
		}

		output.push(getUIDStringFor(this[BLOCK]));
		output.push(`${indent}${text}`);
		output.push(buildStringForChar(char, lineLength));

		return {output};
	}
}
