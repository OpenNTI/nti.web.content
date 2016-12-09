const BLOCK_TYPES = Symbol('Block Types');

export default class Parser {
	constructor () {
		this.context = {};
		this.parsedBlocks = [];
		this.currentBlock = null;

		this[BLOCK_TYPES] = this.getBlockClasses();
	}


	getBlockClasses () {
		return [];
	}


	parseBlocksFromInput (input) {
		return input;
	}


	joinBlocks (blocks/*, context*/) {
		return blocks;
	}


	parse (input) {
		debugger;
		const blocks = this.parseBlocksFromInput(input);

		let context = {};
		let parsedBlocks = [];
		let currentBlock = null;

		for (let block of blocks) {
			let {block:nextBlock, context:nextContext} = this.parseBlock(block, context, currentBlock);

			context = nextContext || context;
			currentBlock = nextBlock;

			if (nextBlock) {
				parsedBlocks.push(nextBlock);
			}
		}

		return {
			parsed: this.joinBlocks(parsedBlocks, context),
			...context
		};
	}


	getClassForBlock (block, context) {
		for (let blockType of this[BLOCK_TYPES]) {
			if (blockType.isTypeForBlock(block, context)) {
				return blockType;
			}
		}
	}


	parseBlock (blockInput, context, currentBlock) {
		const blockClass = this.getClassForBlock(blockInput, context);
		const {block:nextBlock, context:nextContext} = blockClass.parse(blockInput, context, currentBlock);

		if (currentBlock && currentBlock.shouldAppendBlock && currentBlock.shouldAppendBlock(nextBlock, nextContext)) {
			return currentBlock.appendBlock(nextBlock, nextContext);
		}

		return {block: nextBlock, context: nextContext};
	}
}
