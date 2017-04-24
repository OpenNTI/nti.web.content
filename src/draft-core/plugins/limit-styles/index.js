import {RichUtils} from 'draft-js';

import {getAllowedSet} from './utils';

export default (config = {}) => {
	const {allowed, disallowed} = config;

	const allow = getAllowedSet(allowed, disallowed);

	return {

		getContext (getEditorState, setEditorState) {
			return {
				get allowedInlineStyles () {
					return allow;
				},


				get currentInlineStyles () {
					const editorState = getEditorState();

					return editorState.getCurrentInlineStyle();
				},


				toggleInlineStyle (style) {
					const newState = RichUtils.toggleInlineStyle(getEditorState(), style);

					setEditorState(newState, true);
				}
			};
		}
	};
};
