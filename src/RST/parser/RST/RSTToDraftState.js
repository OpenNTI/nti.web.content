import Parser from '../Parser';

import blocks from './blocks';

export default class RSTToDraftState extends Parser {

	getBlockTypes () {
		return blocks;
	}


	formatInput (input) {
		return input.split('\n');
	}


	formatParsed (parsed) {
		const {blocks:parsedBlocks, context} = parsed;

		const draftState = parsedBlocks.reduce((acc, block) => {
			const draft = block.toDraft && block.toDraft(acc.context);
			const {output:draftBlock, context:newContext} = draft || {};

			acc.context = newContext || acc.context;

			if (draftBlock) {
				acc.blocks.push(draftBlock);
			}

			return acc;
		}, {blocks: [], context});

		return {blocks: draftState.blocks, entityMap: draftState.context.entityMap};
	}
}
