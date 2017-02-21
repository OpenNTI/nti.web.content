import React from 'react';
import {BoldButton, ItalicButton, UnderlineButton, LinkButton} from '../../draft-core';

export default function ContentEditorFormatting () {
	return (
		<div className="content-editor-style-format">
			<div className="styles">
				<BoldButton />
				<ItalicButton />
				<UnderlineButton />
			</div>
			<div className="link">
				<LinkButton />
			</div>
		</div>
	);
}
