import {BLOCK_TYPE} from 'draft-js-utils';

function isTitleBlock (block, title) {
	return block && block.type === BLOCK_TYPE.HEADER_ONE && block.text === title;
}

export default function removeTitle (input, options) {
	if (!options || !options.title) { return input;	}

	const {blocks, entityMap} = input;
	const newBlocks = isTitleBlock(blocks[0], options.title) ? blocks.slice(1) : blocks;

	return {blocks: newBlocks, entityMap};
}
