import React from 'react';
import {ContextProvider, BoldButton, ItalicButton, UnderlineButton} from '../../draft-core';

function getEditorForSelection (selection) {
	const first = selection && selection[0];
	let value = first && first.value;
	let editor;

	//If there is more than one don't return any editor for now
	if (value && selection.length === 1) {
		editor = value
	}

	return editor;
}

ContentEditorFormatting.propTypes = {
	selection: React.PropTypes.array
};
export default function ContentEditorFormatting ({selection=[]}) {
	return (
		<ContextProvider editor={getEditorForSelection(selection)}>
			<div>
				<BoldButton />
				<ItalicButton />
				<UnderlineButton />
			</div>
		</ContextProvider>
	)
}
