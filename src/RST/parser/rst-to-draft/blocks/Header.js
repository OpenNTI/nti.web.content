import {BLOCK_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';


//Checks if the line is the same header character repeating
//= - ` : . ' " ~ ^ _ * + #
const IS_LINE_HEADER_REGEX = /^([\=,\-,\+,`,:,\.,',",~,\^,_,\*,#])\1+$/;

export const LEVEL_TO_TYPE = {
	1: BLOCK_TYPE.HEADER_ONE,
	2: BLOCK_TYPE.HEADER_TWO,
	3: BLOCK_TYPE.HEADER_THREE,
	4: BLOCK_TYPE.HEADER_FOUR,
	5: BLOCK_TYPE.HEADER_FIVE,
	6: BLOCK_TYPE.HEADER_SIX
};

export default class Header extends IndentedBlock {
	static isValidOverLined (inputInterface, context, currentBlock) {
		const overline = inputInterface.getInput(0);
		const text = inputInterface.getInput(1);
		const underline = inputInterface.getInput(2);

		//We aren't a valid overlined header unless the line after next is a valid underlined header,
		//meaning its the same length and char as the overline
		return (!currentBlock || !currentBlock.isParagraph) &&
				overline === underline &&
				text.length === overline.length;
	}

	static isValidUnderlined (inputInterface, context, currentBlock) {
		const underline = inputInterface.getInput(0);
		const text = inputInterface.getInput(-1);
		const char = underline.charAt(0);

		//If we have an open header we aren't a valid close unless its the same char
		return currentBlock && currentBlock.isParagraph && currentBlock.isOneLine &&
				(!context.openHeader || context.openHeader === char) &&
				text.length === underline.length;
	}


	static isNextBlock (inputInterface, context, currentBlock) {
		const current = inputInterface.getInput(0);

		return IS_LINE_HEADER_REGEX.test(current) &&
				(this.isValidOverLined(inputInterface, context, currentBlock) ||	this.isValidUnderlined(inputInterface, context, currentBlock));
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

		//If we haven't seen this character yet, add it to the levels
		//make sure we don't go beyond 6 levels
		if (!context.headerLevels.charToLevel[char]) {
			context.headerLevels.currentLevel = Math.min(6, context.headerLevels.currentLevel + 1);
			context.headerLevels.charToLevel[char] = context.headerLevels.currentLevel;
		}

		const level = context.headerLevels.charToLevel[char];
		let newBlock;
		let newContext = {...context};

		//If there is no open block or the current block is not a paragraph, just mark the header being open
		if (!currentBlock || currentBlock.isEmpty) {
			newContext.openHeader = char;
		//If we just parsed a text block, close any open header and return a header block
		} else {
			delete newContext.openHeader;

			//The text block will be used in the new header block, so consume the text block
			//to prevent it from being output.
			currentBlock.consume();

			newBlock = new this(input, '', {level, char, textBlock: currentBlock});
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
