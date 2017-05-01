export default {
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
