import {ContentState, EditorState, Modifier, convertFromHTML} from 'draft-js';

import {HANDLED} from '../Constants';

function cleanText (text) {
	return `<p>${text.replace('\n', ' ')}</p>`;
}

export default {
	create: (/*config = {}*/) => {
		return {
			editorClass: 'single-line',

			handlePastedText (text, html, {getEditorState, setEditorState}) {
				const editorState = getEditorState();
				const blocks = convertFromHTML(html || cleanText(text));

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

				return HANDLED;
			},

			handleReturn () {
				//Block enters from being types
				//by telling the editor we handled the event
				return HANDLED;
			}
		};
	}
};
