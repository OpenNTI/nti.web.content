import Parser from '../../Parser';
import Blocks from './blocks';

export default class TextParser extends Parser {
	getBlockTypes () {
		return Blocks;
	}

	formatInput (input) {
		return input.split('');
	}


	formatParsed (parsed) {
		const {blocks, context} = parsed;

		const parts = blocks.reduce((acc, block) => {
			const {output: text, context:newContext} = block.getOutput(acc.context);

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
}
