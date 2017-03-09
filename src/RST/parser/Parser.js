const BLOCK_TYPES = Symbol('Block Types');
const INPUT_TRANSFORMS = Symbol('Input Transforms');
const OUTPUT_TRANSFORMS = Symbol('Output Transforms');

export function getInterface (currentIndex, inputs) {
	return {
		get (offset = 0) {
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

	/**
	 * Create a parser with the given blockTypes and transforms
	 *
	 * block types is a list of blocks that could be in the input, they will
	 * be checked in the order given.
	 * At a minimum the types need to statically have:
	 *
	 * isNextBlock(inputInterface, context, currentBlock) method to see if this is the next block in the input or not
	 * parse(inputInterface, context, currentBlock) method to parse the block
	 * 		returns an object {block: the parsed block, context: the new context for the parser}
	 * 		both properties are optional
	 *
	 * The parsed block can optionally define:
	 *
	 * shouldAppendBlock(block, context) method to see if the next block should be appended or not
	 * append(block, context) method to append the next block to this block.
	 * 		same return value as parse
	 *
	 *
	 * input and output transforms are a list of functions to call on the
	 * input/output respectively, where the return of one transform is passed
	 * as the argument to the next
	 *
	 * @param  {Array} blockTypes        the list of block types to look for in the input
	 * @param  {Array}  inputTransforms  the list of transforms to apply to the input
	 * @param  {Array}  outputTransforms the list of transforms to apply to the output
	 * @return {Parser}                  the initialized Parse with these block types and transforms
	 */
	constructor (blockTypes = [], inputTransforms = [], outputTransforms = []) {
		//TODO: decide if we need to formalize the context beyond a simple object
		this.context = this.blankContext;

		this[BLOCK_TYPES] = blockTypes;
		this[INPUT_TRANSFORMS] = inputTransforms;
		this[OUTPUT_TRANSFORMS] = outputTransforms;
	}


	/**
	 * Run the input through the list of input transforms to get the
	 * iterable item to run though the parser
	 *
	 * @param  {Mixed} input what to parse
	 * @param {Object} options configuration options
	 * @return {Array}       the blocks in the input
	 */
	formatInput (input, options) {
		return this[INPUT_TRANSFORMS].reduce((acc, transform) => {
			return transform(acc, options);
		}, input);
	}

	/**
	 * Run the parsed data through the list of output transforms
	 *
	 * @param {Object} parsed the result of parsing
	 * @param {Array} parsed.blocks the blocks that were parsed from the input
	 * @param {Object} parsed.context the context set while parsing the blocks
	 * @param {Object} options configuration options
	 * @return {Object}        the formatted version to output
	 */
	formatParsed (parsed, options) {
		return this[OUTPUT_TRANSFORMS].reduce((acc, transform) => {
			return transform(acc, options);
		}, parsed);
	}


	/**
	 * Run an input through the parser.
	 *
	 * Return the parsedBlocks and the context of the parser
	 *
	 * @param  {Mixed} input what to parse
	 * @param {Object} options options to configure the parser
	 * @return {Object}       the result of parsing
	 */
	parse (input, options) {
		const {input:parsedInputs, context:parsedContext} = this.formatInput({input, context: {}}, options);

		let context = {...parsedContext};
		let blocks = [];
		let currentBlock = null;

		let i = 0;

		while (i < parsedInputs.length) {
			let inputInterface = getInterface(i, parsedInputs);
			let parsedInterface = getInterface(blocks.length - 1, blocks);
			let {block, context:newContext, length} = this.parseNextBlock(inputInterface, context, parsedInterface);

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
		}, options);
	}

	/**
	 * Given a block from the input determine which type to use
	 * to parse it.
	 *
	 * @param  {Object} inputInterface   the remaining inputs
	 * @param  {Object} context the context of the parser
	 * @param  {Object} parsedInterface the already parsed inputs
	 * @return {Object}        the block to use to parse
	 */
	getClassForBlock (inputInterface, context, parsedInterface) {
		for (let blockType of this[BLOCK_TYPES]) {
			if (blockType.isNextBlock(inputInterface, context, parsedInterface)) {
				return blockType;
			}
		}
	}


	parseNextBlock (inputInterface, context, parsedInterface) {
		const blockClass = this.getClassForBlock(inputInterface, context, parsedInterface);

		if (!blockClass) {
			//TODO: warn if there is no block class
			return {};
		}

		const {block:nextBlock, context:nextContext, length} = blockClass.parse(inputInterface, context, parsedInterface);
		const currentBlock = parsedInterface.get(0);

		let parsed;

		if (currentBlock && nextBlock && currentBlock.shouldAppendBlock && currentBlock.shouldAppendBlock(nextBlock, nextContext, inputInterface)) {
			parsed = currentBlock.appendBlock(nextBlock, nextContext, inputInterface);
		} else {
			parsed = {block:nextBlock, context:nextContext};
		}

		//Even if the block is appended, we still need to advance the parser the length of the block we just parsed;
		parsed.length = length;

		return parsed;
	}
}
