import React from 'react';
import {BoldButton, ItalicButton, UnderlineButton} from '../../draft-core';

export default function ContentEditorFormatting () {
	return (
		<div className="content-editor-style-format">
			<BoldButton />
			<ItalicButton />
			<UnderlineButton />
		</div>
	)
}
