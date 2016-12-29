import {BLOCK_TYPE} from 'draft-js-utils';

import Block from './Block';


//Checks if the line is the same header character repeating
//= - ` : . ' " ~ ^ _ * + #
const IS_LINE_HEADER_REGEX = /^([\=,\-,\+,`,:,\.,',",~,\^,_,\*,#])\1+$/;

const LEVEL_TO_TYPE = {
	1: BLOCK_TYPE.HEADER_ONE,
	2: BLOCK_TYPE.HEADER_TWO,
	3: BLOCK_TYPE.HEADER_THREE,
	4: BLOCK_TYPE.HEADER_FOUR,
	5: BLOCK_TYPE.HEADER_FIVE,
	6: BLOCK_TYPE.HEADER_SIX
};

export default class Header extends Block {
	static isNextBlock (inputInterface) {
		const input = inputInterface.getInput();

		return IS_LINE_HEADER_REGEX.test(input);
	}

	static parse (inputInterface, context, currentBlock) {
		if (!context.headerLevels) {
			context.headerLevels = {
				charToLevel: {},
				currentLevel: 0
			};
		}

		const input = inputInterface.getInput();
		const char = input.charAt(0);

		//If we have an open header for a different character, this is
		//an invalid header input
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

		//TODO: look into stream
		//If there is no open block or the current block is not a paragraph, just mark the header being open
		if (!currentBlock || !currentBlock.isParagraph) {
			newContext.openHeader = char;
		//If we just parsed a text block, close any open header and return a header block
		} else {
			delete newContext.openHeader;

			//The text block will be used in the new header block, so consume the text block
			//to prevent it from being output.
			currentBlock.consume();

			newBlock = new this(input, {level, char, textBlock: currentBlock});
		}

		return {block: newBlock, context: newContext};
	}


	getOutput (context) {
		const {level, char, textBlock} = this.parts;
		const type = LEVEL_TO_TYPE[level];
		const {output, context:newContext} = textBlock.getOutput(context, true);
		const data = output.data ? {...output.data, char} : {char};

		return {output: {...output, type, data}, newContext};
	}
}
