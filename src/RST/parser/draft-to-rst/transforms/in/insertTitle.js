import {BLOCK_TYPE} from 'draft-js-utils';

function buildTitle (title) {
	return {
		data: {},
		entityRanges: [],
		inlineStyleRanges: [],
		depth: 0,
		type: BLOCK_TYPE.HEADER_ONE,
		text: title
	};
}

export default function insertTitle (inputContext, options) {
	if (!options || !options.title) { return inputContext; }

	const {input, context} = inputContext;
	const newInput = [buildTitle(options.title), ...input];

	return {input: newInput, context};
}
