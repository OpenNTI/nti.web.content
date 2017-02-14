import {INLINE_STYLE, BLOCK_TYPE} from 'draft-js-utils';
import {EditorState, Modifier, SelectionState} from 'draft-js';

export const STYLE_SET = [
	INLINE_STYLE.BOLD,
	INLINE_STYLE.CODE,
	INLINE_STYLE.ITALIC,
	INLINE_STYLE.STRIKETHROUGH,
	INLINE_STYLE.UNDERLINE
];

export const BLOCK_SET = [
	BLOCK_TYPE.ATOMIC,
	BLOCK_TYPE.BLOCKQUOTE,
	BLOCK_TYPE.CODE,
	BLOCK_TYPE.HEADER_FIVE,
	BLOCK_TYPE.HEADER_FOUR,
	BLOCK_TYPE.HEADER_ONE,
	BLOCK_TYPE.HEADER_SIX,
	BLOCK_TYPE.HEADER_THREE,
	BLOCK_TYPE.HEADER_TWO,
	BLOCK_TYPE.ORDERED_LIST_ITEM,
	BLOCK_TYPE.PULLQUOTE,
	BLOCK_TYPE.UNORDERED_LIST_ITEM,
	BLOCK_TYPE.UNSTYLED
];


function arrayToMap (a) {
	return a.reduce((acc, x) => {
		acc[x] = true;

		return acc;
	}, {});
}


function diff (allowed, all) {
	const allowedMap = arrayToMap(allowed);

	return all.filter(x => !allowedMap[x]);
}


function computeDisallowedBlocks (allowedBlocks) {
	return diff(allowedBlocks, BLOCK_SET);
}


function computeDisallowedStyles (allowedStyles) {
	return diff(allowedStyles, STYLE_SET);
}


function cleanStyles (disallowed, content, range, block) {
	let styles = new Set();

	block.findStyleRanges(x => styles = new Set([...styles, ...x.getStyle()]), () => {});

	for (let style of styles) {
		if (disallowed[style]) {
			content = Modifier.removeInlineStyle(content, range, style);
		}
	}

	return content;
}


function cleanBlock (disallowed, content, range, block) {
	if (disallowed[block.type]) {
		content = Modifier.setBlockType(content, range, BLOCK_TYPE.UNSTYLED);
	}

	return content;
}


function cleanLinks (disallowed, content/*, range, block*/) {
	//TODO: fill this out

	return content;
}

export default function fixStateForAllowed (newState, allowedStyles = [], allowedBlocks = [], allowLinks = true) {
	const disallowedStyles = computeDisallowedStyles(allowedStyles);
	const disallowedBlocks = computeDisallowedBlocks(allowedBlocks);

	if (disallowedStyles.length > 0 && disallowedBlocks.length > 0 && allowLinks) { return newState; }

	const styleMap = arrayToMap(disallowedStyles);
	const blockMap = arrayToMap(disallowedBlocks);

	let content = newState.getCurrentContent();
	const originalContent = content;

	for (let block of content.getBlocksAsArray()) {
		const blockKey = block.getKey();
		const range = new SelectionState({
			anchorKey: blockKey,
			anchorOffset: 0,
			focusKey: blockKey,
			focusOffset: block.getLength()
		});

		if (disallowedStyles.length > 0) {
			content = cleanStyles(styleMap, content, range, block);
		}

		if (!allowLinks) {
			content = cleanLinks(content, range, block);
		}

		if (disallowedStyles.length > 0) {
			content = cleanBlock(blockMap, content, range, block);
		}
	}

	const blocks = content.getBlocksAsArray();

	if (blocks.length < 1) { return; }

	if (content === originalContent) { return; }

	return EditorState.create({
		currentContent: content,
		allowUndo: newState.getAllowUndo(),
		decorator: newState.getDecorator(),
		selection: newState.getSelection()
	});
}
