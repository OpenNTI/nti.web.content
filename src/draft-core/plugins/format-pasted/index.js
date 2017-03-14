import formatHTML from './formatHTML';

import {HANDLED, NOT_HANDLED} from '../Constants';

const formatters = [
	formatHTML
];

function getStateForPasted (text, html, editorState, config) {
	for (let format of formatters) {
		if (format.shouldFormat(text, html, editorState, config)) {
			return format.format(text, html, editorState, config);
		}
	}
}

//https://github.com/facebook/draft-js/issues/416#issuecomment-221639163
export default (config = {}) => {
	return {
		handlePastedText (text, html, {getEditorState, setEditorState}) {
			const newState = getStateForPasted(text, html, getEditorState(), config);

			if (!newState) { return NOT_HANDLED; }

			setEditorState(newState);

			return HANDLED;
		}
	};
};