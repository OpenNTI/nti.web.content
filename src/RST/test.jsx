import React from 'react';
import {Editor, EditorState} from 'draft-js';
import parseXML, {TestXML} from './DraftStateFromXML';


export default function DraftToXMLText () {
	const state = parseXML(TestXML);
	const editorState = EditorState.createWithContent(state);

	return (
		<Editor editorState={editorState} />
	);
}
