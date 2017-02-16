import React from 'react';

import MetaEditor from '../meta-editor';
import RSTEditor from '../rst-editor';

export default function EditorPanelContent ({content, course}) {
	return (
		<div>
			<MetaEditor content={content} course={course} />
			<RSTEditor content={content} course={course} />
		</div>
	);
}
