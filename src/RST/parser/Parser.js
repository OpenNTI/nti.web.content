const BLOCK_TYPES = Symbol('Block Types');

export default class Parser {
	constructor () {
		//TODO: decide if we need to formalize the context beyond a simple object
		this.context = {};

		this[BLOCK_TYPES] = this.getBlockTypes();
	}

	/**
	 * Return the list of types to check the parts of the input against, the types
	 * will be checked in order.
	 * At a minimum the types need to have:
	 *
	 * isTypeForBlock(block, context) method to see if this is the block for a part or not
	 *
	 * parse(block, context, currentBlock) method to parse the block
	 *     returns an object {block: the parsed block, context: the new context for the parser}
	 *     both properties are optional
	 *
	 * They can define optionally:
	 *
	 * shouldAppendBlock(block, context) method to see if the next block should be appended or not
	 *
	 * appendBlock(block, context) method to append the block to this block.
	 *     should have the same return value as parse
	 *
	 * @return {[Object]} the list of block types
	 */
	getBlockTypes () {
		return [];
	}

	/**
	 * Given the input into the parser, format it into an iterable object
	 * of the blocks in the input to parse.
	 *
	 * @param  {Mixed} input what to parse
	 * @return {Array}       the blocks in the input
	 */
	formatInput (input) {
		return input;
	}

	/**
	 * After running through the parse, give subclasses a chance to control
	 * the format of the output.
	 *
	 * @param {Object} parsed the result of parsing
	 * @param {Array} blocks the blocks that were parsed from the input
	 * @param {Object} context the context set while parsing the blocks
	 * @return {Object}        the formatted version to output
	 */
	formatParsed (parsed) {
		return parsed;
	}


	/**
	 * Run an input through the parser.
	 *
	 * Return the parsedBlocks and the context of the parser
	 *
	 * @param  {Mixed} input what to parse
	 * @return {Object}       the result of parsing
	 */
	parse (input) {
		const blocks = this.formatInput(input);

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

		return this.formatParsed({
			blocks: parsedBlocks,
			context
		});
	}

	/**
	 * Given a block from the input determine which type to use
	 * to parse it.
	 *
	 * @param  {Mixed} blockInput   a block from the input
	 * @param  {Object} context the context of the parser
	 * @return {Object}        the block to use to parse
	 */
	getClassForBlock (blockInput, context) {
		for (let blockType of this[BLOCK_TYPES]) {
			if (blockType.isTypeForBlock(blockInput, context)) {
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
