export default function (parsed) {
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

	return {blocks: draftState.blocks, entityMap: draftState.context.entityMap || {}};
}
