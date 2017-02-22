import {ContentState, EditorState, Modifier, convertFromHTML} from 'draft-js';

export default (/*config = {}*/) => {
	return {
		editorClass: 'single-line',

		handlePastedText (text, html, {getEditorState, setEditorState}) {
			const editorState = getEditorState();
			const blocks = convertFromHTML(html || text);

			if (blocks.length <= 1) { //let draft do its thing.
				return;
			}

			//insert only the first block. TODO: figure out how to join blocks together.

			// function join (a: ?ContentBlock, b: ContentBlock) {}
			// const singleBlock = blocks.reduce((out, block) => join(out, block));

			const newContent = Modifier.replaceWithFragment(
				editorState.getCurrentContent(),
				editorState.getSelection(),
				ContentState.createFromBlockArray([blocks[0]]).getBlockMap()
			);

			setEditorState(EditorState.push(
				editorState,
				newContent,
				'insert-fragment'
			));

			return true;
		},

		handleReturn () {
			//Block enters from being types
			//by telling the editor we handled the event
			return true;
		}
	};
};
