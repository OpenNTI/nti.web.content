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

		const draftBlocks = parsedBlocks.reduce((acc, block) => {
			const draftBlock = block.getOutput && block.getOutput(context);

			if (draftBlock) {
				acc.push(draftBlock);
			}

			return acc;
		}, []);

		return {blocks: draftBlocks, entityMap: context.entityMap};
	}
}
