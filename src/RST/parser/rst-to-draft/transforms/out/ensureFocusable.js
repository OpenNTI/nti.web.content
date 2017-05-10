import {BLOCKS} from '../../../../../draft-core';

const emptyParagraph = {
	type: BLOCKS.UNSTYLED,
	text: '',
	depth: 0,
	inlineStyleRanges: [],
	entityRanges: []
};

export default function (output) {
	const {blocks, entityMap} = output;
	let newBlocks = blocks;

	if (blocks[0].type === BLOCKS.ATOMIC) {
		newBlocks = [emptyParagraph, ...newBlocks];
	}

	if (blocks[blocks.length - 1].type === BLOCKS.ATOMIC) {
		newBlocks = [...newBlocks, emptyParagraph];
	}

	return {blocks: newBlocks, entityMap};
}
