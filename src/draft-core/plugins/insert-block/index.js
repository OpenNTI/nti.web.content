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
						//TODO: fill this out
						return 0;
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
