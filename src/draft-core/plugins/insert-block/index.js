import Button from './components/Button';
import BlockCount from './components/BlockCount';

export default {
	components: {Button, BlockCount},

	create: (config = {}) => {
		return {
			getContext (getEditorState, setEditorState) {
				return {
					allowInsertBlock: () => {
						//TODO: add a config for disabling inserting blocks given certain selections
						return true;
					},

					getInsertBlockCount: (predicate) => {
						//TODO: fill this out
						return 0;
					},

					insertBlock: () => {
						debugger;
					}
				};
			}
		};
	}
};
