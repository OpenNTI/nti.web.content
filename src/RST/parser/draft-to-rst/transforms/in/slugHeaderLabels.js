import {BLOCKS} from 'nti-web-editor';

const MAX_SLUG_LENGTH = 50;

const TYPES_TO_SLUG = {
	[BLOCKS.HEADER_ONE]: true,
	[BLOCKS.HEADER_TWO]: true
};

function buildSlug (label) {
	const slug = label.substr(0, MAX_SLUG_LENGTH);

	return slug;
}

function getSlug (block) {
	return block.data && block.data.label;
}

export default function (inputContext) {
	const {input:blocks, context} = inputContext;
	let seenCount = {};
	let headersToSlug = [];

	for (let block of blocks) {
		if (!TYPES_TO_SLUG[block.type]) { continue; }

		let slug = getSlug(block);

		if (!slug) {
			headersToSlug.push(block);
			slug = buildSlug(block.text);
			block.data = block.data || {};
			block.data.label = slug;
		}

		seenCount[slug] = seenCount[slug] ? seenCount[slug] + 1 : 1;
	}

	for (let block of headersToSlug) {
		const slug = block.data.label;

		if (seenCount[slug] > 1) {
			block.data.label = slug + `(${seenCount[slug]})`;
			seenCount[slug] -= 1;
		}

	}

	return {input: blocks, context};
}
