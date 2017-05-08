import Button from './components/Button';
import BlockCount from './components/BlockCount';
import {insertBlock} from './utils';

//https://github.com/facebook/draft-js/issues/442

export default {
	components: {Button, BlockCount},

	create: (config = {}) => {
		return {
			getContext (getEditorState, setEditorState) {
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

					insertBlock: (block, replaceRange) => {
						const newState = insertBlock(block, replaceRange, getEditorState());

						setEditorState(newState);
					}
				};
			}
		};
	}
};
