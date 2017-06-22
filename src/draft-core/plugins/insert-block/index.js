import {EditorState, SelectionState, Modifier} from 'draft-js';

import {EVENT_HANDLED, EVENT_NOT_HANDLED} from '../Constants';

import Button from './components/Button';
import BlockCount from './components/BlockCount';
import {DRAG_DATA_TYPE} from './Constants';
import {insertBlock, getSelectedText} from './utils';

const moveSelectionToNextBlock = editorState => {
	const selectionState = editorState.getSelection && editorState.getSelection();
	const contentState = editorState.getCurrentContent && editorState.getCurrentContent();
	const nextBlock = contentState && contentState.getBlockAfter(selectionState.focusKey);

	if (editorState && contentState) {
		let newEditorState;

		if (nextBlock) {
			newEditorState = EditorState.acceptSelection(editorState, SelectionState.createEmpty(nextBlock.getKey()));
		} else {
			const newContent = Modifier.insertText(contentState, selectionState, '\n', editorState.getCurrentInlineStyle(), null);
			const tmpEditorState = EditorState.push(editorState, newContent, 'insert-characters');
			newEditorState = EditorState.acceptSelection(tmpEditorState, SelectionState.createEmpty(newContent.getLastBlock().getKey()));
		}

		return newEditorState;
	}

	return editorState;
};

//https://github.com/facebook/draft-js/issues/442

export default {
	components: {Button, BlockCount},

	create: (/*config = {}*/) => {
		const insertionHandlers = {};

		return {
			handleDrop (selection, dataTransfer) {
				const insertionId = dataTransfer.data.getData(DRAG_DATA_TYPE);
				const handler = insertionHandlers[insertionId];


				if (handler) {
					handler(selection);
					return EVENT_HANDLED;
				}

				return EVENT_NOT_HANDLED;
			},


			getContext (getEditorState, setEditorState, focus) {
				return {
					get allowInsertBlock () {
						//TODO: add a config for disabling inserting blocks given certain selections
						return true;
					},

					getInsertBlockCount: (predicate) => {
						const state = getEditorState();
						const content = state.getCurrentContent();
						const blocks = content.getBlocksAsArray();

						return blocks.filter(predicate).length;
					},


					getInsertMethod: (selection) => {
						return (block, replaceRange) => {
							const newState = insertBlock(block, replaceRange, selection, getEditorState());

							setEditorState(block.maintainSelection ? newState : moveSelectionToNextBlock(newState), focus);
						};
					},


					getSelectedTextForInsertion: () => {
						return getSelectedText(getEditorState());
					},


					registerInsertHandler (id, handler) {
						insertionHandlers[id] = handler;
					},


					unregisterInsertHandler (id) {
						delete insertionHandlers[id];
					}
				};
			}
		};
	}
};
