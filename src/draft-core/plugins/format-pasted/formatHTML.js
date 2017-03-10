import {
	DefaultDraftBlockRenderMap,
	ContentState,
	Modifier,
	EditorState,
	convertFromHTML,
	getSafeBodyFromHTML
} from 'draft-js';


const BlockRenderMap = DefaultDraftBlockRenderMap.set('p', {element: 'p'});

function formatBlocks (blocks, formatTypeChangeMap) {
	return blocks.map(block => {
		const oldType = block.getType();
		const newType = formatTypeChangeMap[oldType];

		return newType ? block.set('type', newType) : block;
	});
}

function getFormatTypeChangeMap (config) {
	const map = config.formatTypeChangeMap || {};

	if (!map['p']) {
		map['p'] = 'unstyled';
	}

	return map;
}

export default {
	shouldFormat (text, html) {
		return !!html;
	},


	format (text, html, editorState, config) {
		const blocksFromHTML = convertFromHTML(html, getSafeBodyFromHTML, BlockRenderMap);
		const formatTypeChangeMap = getFormatTypeChangeMap(config);
		const formattedBlocks = formatBlocks(blocksFromHTML, formatTypeChangeMap);

		const fragment = ContentState.createFromBlockArray(formattedBlocks);

		const newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment.blockMap);

		return EditorState.push(editorState, newState, 'insert-fragment');
	}
};
