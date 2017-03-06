import formatHTML from './formatHTML';

import {HANDLED, NOT_HANDLED} from '../Constants';

const formatters = [
	formatHTML
];

function getStateForPasted (text, html, editorState) {
	for (let format of formatters) {
		if (format.shouldFormat(text, html, editorState)) {
			return format.format(text, html, editorState);
		}
	}
}

//https://github.com/facebook/draft-js/issues/416#issuecomment-221639163
export default (/*config = {}*/) => {
	return {
		handlePastedText (text, html, {getEditorState, setEditorState}) {
			const newState = getStateForPasted(text, html, getEditorState());

			if (!newState) { return NOT_HANDLED; }

			setEditorState(newState);

			return HANDLED;
		}
	};
};
