export default function (parsed) {
	const {blocks, context} = parsed;

	const rst = blocks.reduce((acc, block) => {
		const rstBlock = block.getOutput && block.getOutput(acc.context);
		const {output, context:newContext} = rstBlock || {};

		acc.context = newContext || acc.context;

		if (Array.isArray(output)) {
			acc.blocks = acc.blocks.concat(output);
		} else {
			acc.blocks.push(output);
		}

		if (block.followWithBlankLine) {
			acc.blocks.push('');
		}

		return acc;
	}, {blocks: [], context});

	return rst.blocks.join('\n');
}
