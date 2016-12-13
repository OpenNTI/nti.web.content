import {BLOCK_TYPE} from 'draft-js-utils';

import Block from './Block';


//Checks if the line is the same header character repeating
//TODO: add the other header characters
const IS_LINE_HEADER_REGEX = /^([\=,\-,\+])\1+$/;

const LEVEL_TO_TYPE = {
	1: BLOCK_TYPE.HEADER_ONE,
	2: BLOCK_TYPE.HEADER_TWO,
	3: BLOCK_TYPE.HEADER_THREE,
	4: BLOCK_TYPE.HEADER_FOUR,
	5: BLOCK_TYPE.HEADER_FIVE,
	6: BLOCK_TYPE.HEADER_SIX
};

export default class Header extends Block {
	static isTypeForBlock (block) {
		return IS_LINE_HEADER_REGEX.test(block);
	}

	static parse (block, context, currentBlock) {
		if (!context.headerLevels) {
			context.headerLevels = {
				charToLevel: {},
				currentLevel: 0
			};
		}

		const char = block.charAt(0);

		//If we have an open header for a different character, this is
		//an invalid header block
		if (context.openHeader && context.openHeader !== char) {
			throw new Error('Invalid Header Block');
		}

		//If we haven't seen this character yet, add it to the levels
		//make sure we don't go beyond 6 levels
		if (!context.headerLevels.charToLevel[char]) {
			context.headerLevels.currentLevel = Math.min(6, context.headerLevels.currentLevel + 1);
			context.headerLevels.charToLevel[char] = context.headerLevels.currentLevel;
		}


		const level = context.headerLevels.charToLevel[char];
		let newBlock;
		let newContext = {...context};

		//If there is no open block, just mark the header being open
		if (!currentBlock) {
			newContext.openHeader = char;
		//If we just parsed a text block, close any open header and return a header block
		} else if (currentBlock.isParagraph) {
			delete newContext.openHeader;

			//The text block will be used in the new header block, so consume the text block
			//to prevent it from being output.
			currentBlock.consume();

			newBlock = new this(block, {level, char, textBlock: currentBlock});
		//If we have a current block and its not a text block, its not a valid place for
		//a header
		} else {
			throw new Error('Invalid Header Block');
		}

		return {block: newBlock, context: newContext};
	}


	getOutput (context) {
		debugger;
		const {level, char, textBlock} = this.parts;
		const type = LEVEL_TO_TYPE[level];
		const {output, context:newContext} = textBlock.getOutput(context, true);
		const data = output.data ? {...output.data, char} : {char};

		return {output: {...output, type, data}, newContext};
	}
}
