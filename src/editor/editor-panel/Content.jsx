import React from 'react';

import MetaEditor from '../meta-editor';
import ContentEditor from '../content-editor';

export default function EditorPanelContent ({content, course}) {
	return (
		<div>
			<MetaEditor content={content} course={course} />
			<ContentEditor content={content} course={course} />
		</div>
	);
}
