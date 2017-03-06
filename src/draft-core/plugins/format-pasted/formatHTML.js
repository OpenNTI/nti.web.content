import {
	DefaultDraftBlockRenderMap,
	ContentState,
	Modifier,
	EditorState,
	convertFromHTML,
	getSafeBodyFromHTML
} from 'draft-js';


const BlockRenderMap = DefaultDraftBlockRenderMap.set('p', {element: 'p'});

export default {
	shouldFormat (text, html) {
		return !!html;
	},


	format (text, html, editorState) {
		const blocksFromHTML = convertFromHTML(html, getSafeBodyFromHTML, BlockRenderMap);
		const fragment = ContentState.createFromBlockArray(blocksFromHTML.map(block => {
			return block.get('type') === 'p' ? block.set('type', 'unstyled') : block;
		}));

		const newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment.blockMap);

		return EditorState.push(editorState, newState, 'insert-fragment');
	}
};
