import Button from './components/Button';

export default {
	components: {Button},

	create: (config = {}) => {
		return {
			getContext (getEditorState, setEditorState) {
				return {
					allowInsertBlock: () => {
						//TODO: add a config for disabling inserting blocks given certain selections
						return true;
					},

					insertBlock: () => {
						debugger;
					}
				};
			}
		};
	}
};
