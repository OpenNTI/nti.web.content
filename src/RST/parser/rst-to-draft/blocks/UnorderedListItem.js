import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';
import Text from './Text';

//Capture list items
const UNORDERED_LIST_ITEM = /^\s*-\s(.*)/;

export default class UnorderedListItem extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get();

		return UNORDERED_LIST_ITEM.test(input);
	}


	static parse (inputInterface, context) {
		const input = inputInterface.get();
		const matches = input.match(UNORDERED_LIST_ITEM);
		const text = matches[1];

		return {block: new this(input, '-', {text: new Text(text)}), context};
	}


	get text () {
		return this.parts.text;
	}


	shouldAppendBlock (block) {
		return block && block.isParagraph && this.isSameOffset(block);
	}


	appendBlock (block) {
		this.parts.text.append(block.text);

		return {block: this};
	}


	getOutput (context) {
		const {text} = this;
		const {output, context:newContext} = text.getOutput(context);

		return {output: {...output, depth: this.depth, type: BLOCK_TYPE.UNORDERED_LIST_ITEM}, newContext};
	}
}
