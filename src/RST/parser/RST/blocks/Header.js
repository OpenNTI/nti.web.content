import {BLOCK_TYPE} from 'draft-js-utils';

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

export default class Header {
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

		if (context.openHeader && context.openHeader !== char) {
			throw new Error('Invalid Header Block');
		}

		if (!context.headerLevels.charToLevel[char]) {
			context.headerLevels.charToLevel[char] = context.headerLevels.currentLevel + 1;
			context.headerLevels.currentLevel += 1;
		}

		const level = context.headerLevels.charToLevel[char];
		let newBlock;
		let newContext = {...context};

		//If there is no open block, just mark the header being open
		if (!currentBlock) {
			newContext.openHeader = char;
		//If we just parsed a text block, close any open header and return a header block
		} else if (currentBlock.isTextBlock) {
			delete newContext.openHeader;

			newBlock = new Header(level, char, currentBlock);
		} else {
			throw new Error('Invalid Header Block');
		}

		return {block: newBlock, context: newContext};
	}


	constructor (level, char, textBlock) {
		textBlock.consume();

		this.level = level;
		this.char = char;
		this.textBlock = textBlock;
	}


	getOutput (context) {
		const type = LEVEL_TO_TYPE[this.level];
		const block = this.textBlock.getOutput(context, true);

		return {...block, type};
	}
}
