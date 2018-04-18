import {BLOCKS} from '@nti/web-editor';

const INSERT_BEFORE_SET = new Set([BLOCKS.HEADER_ONE, BLOCKS.HEADER_TWO, BLOCKS.HEADER_THREE, BLOCKS.HEADER_FOUR, BLOCKS.HEADER_FIVE, BLOCKS.HEADER_SIX, BLOCKS.ATOMIC]);

const getEmptyParagraph = () => {
	return {
		type: BLOCKS.UNSTYLED,
		text: '',
		depth: 0,
		inlineStyleRanges: [],
		entityRanges: []
	};
};

//TODO: look into a more efficient way to do this
export default function (output) {
	const {blocks, entityMap} = output;
	let newBlocks = [];

	for (let i = 0; i < blocks.length; i++) {
		let block = blocks[i];
		let prevBlock = blocks[i - 1];

		if (prevBlock && block.type === BLOCKS.ATOMIC && INSERT_BEFORE_SET.has(prevBlock.type)) {
			newBlocks.push(getEmptyParagraph());
		}

		newBlocks.push(block);
	}

	if (newBlocks[newBlocks.length - 1].type === BLOCKS.ATOMIC) {
		newBlocks.push(getEmptyParagraph());
	}

	return {blocks: newBlocks, entityMap};
}
