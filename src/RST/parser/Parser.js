const BLOCK_TYPES = Symbol('Block Types');

function getInputInterface (currentIndex, inputs) {
	return {
		getInput (offset = 0) {
			const index = currentIndex + offset;

			if (index < 0 || (index - 1) > inputs.length) {
				return null;
			}

			return inputs[index];
		}
	};
}

export default class Parser {
	blankContext = {}

	constructor () {
		//TODO: decide if we need to formalize the context beyond a simple object
		this.context = this.blankContext;

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
		const parsedInputs = this.formatInput(input);

		let context = {};
		let blocks = [];
		let currentBlock = null;

		let i = 0;

		while (i < parsedInputs.length) {
			let {block, context:newContext, length} = this.parseNextBlock(getInputInterface(i, parsedInputs), context, currentBlock);

			if (block && block !== currentBlock) {
				blocks.push(block);
			}

			context = newContext || context;
			currentBlock = block;

			i += (length || 1);
		}

		return this.formatParsed({
			blocks,
			context
		});
	}

	/**
	 * Given a block from the input determine which type to use
	 * to parse it.
	 *
	 * @param  {Object} inputInterface   the remaining inputs
	 * @param  {Object} context the context of the parser
	 * @param  {Object} currentBlock the current block of the parser
	 * @return {Object}        the block to use to parse
	 */
	getClassForBlock (inputInterface, context, currentBlock) {
		for (let blockType of this[BLOCK_TYPES]) {
			if (blockType.isNextBlock(inputInterface, context, currentBlock)) {
				return blockType;
			}
		}
	}


	parseNextBlock (inputInterface, context, currentBlock) {
		const blockClass = this.getClassForBlock(inputInterface, context, currentBlock);
		const {block:nextBlock, context:nextContext, length} = blockClass.parse(inputInterface, context, currentBlock);
		let parsed;

		if (currentBlock && currentBlock.shouldAppendBlock && currentBlock.shouldAppendBlock(nextBlock, nextContext, inputInterface)) {
			parsed = currentBlock.appendBlock(nextBlock, nextContext, inputInterface);
		} else {
			parsed = {block:nextBlock, context:nextContext};
		}

		parsed.length = length;

		return parsed;
	}
}
