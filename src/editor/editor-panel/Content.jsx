import React from 'react';

import MetaEditor from '../meta-editor';
import ContentEditor from '../content-editor';

EditorPanelContent.propTypes = {
	contentPackage: React.PropTypes.object,
	course: React.PropTypes.object
};
export default function EditorPanelContent ({contentPackage, course}) {
	return (
		<div>
			<MetaEditor contentPackage={contentPackage} course={course} />
			<ContentEditor contentPackage={contentPackage} course={course} />
		</div>
	);
}
