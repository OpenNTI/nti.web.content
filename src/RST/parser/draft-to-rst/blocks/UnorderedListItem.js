import {BLOCK_TYPE} from 'draft-js-utils';

import {getUIDStringFor} from '../utils';
import parseText from '../text-parser';

const BLOCK = Symbol('Block');

export function getIndentForDepth (depth) {
	return Array(depth + 1).join('  ');
}

export default class UnorderedListItem {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return input.type === BLOCK_TYPE.UNORDERED_LIST_ITEM;
	}

	static parse (inputInterface) {
		const input = inputInterface.get(0);

		return {block: new this(input)};
	}

	constructor (block) {
		this[BLOCK] = block;
		this.blocks = [block];
	}

	get block () {
		return this[BLOCK];
	}

	get type () {
		return this[BLOCK].type;
	}

	shouldAppendBlock (block) {
		return block.type === BLOCK_TYPE.UNORDERED_LIST_ITEM;
	}

	appendBlock (block) {
		this.blocks.push(block.block);

		return {block: this};
	}

	getOutput (context) {
		const {blocks} = this;
		let output = [];
		let currentDepth = 0;

		for (let block of blocks) {
			let {depth} = block;
			let text = parseText(block, context);
			let indent = getIndentForDepth(depth);

			if (depth !== currentDepth) {
				output.push('');
			}

			currentDepth = depth;

			output.push(getUIDStringFor(block));
			output.push(`${indent}- ${text}`);
		}

		return {output};
	}
}
