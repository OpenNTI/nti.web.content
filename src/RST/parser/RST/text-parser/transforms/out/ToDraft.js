export default function (parsed) {
	const {blocks, context} = parsed;

	const parts = blocks.reduce((acc, block) => {
		const output = block.getOutput && block.getOutput(acc.context);
		const {output: text, context:newContext} = output || {};

		acc.context = newContext || acc.context;

		if (text) {
			acc.text = acc.text + text;
		}

		return acc;
	}, {text: '', context: {...context, charCount: 0, inlineStyleRanges: [], entityRanges: [], entityMap: {}}});

	return {
		text: parts.text,
		entityRanges: parts.context.entityRanges,
		inlineStyleRanges: parts.context.inlineStyleRanges,
		entityMap: parts.context.entityMap
	};
}
