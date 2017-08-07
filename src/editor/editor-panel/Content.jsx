import PropTypes from 'prop-types';
import React from 'react';

import MetaEditor from '../meta-editor';
import ContentEditor from '../content-editor';

EditorPanelContent.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object,
	readOnly: PropTypes.bool
};
export default function EditorPanelContent ({contentPackage, course, readOnly}) {
	return (
		<div>
			<MetaEditor contentPackage={contentPackage} course={course} readOnly={readOnly} />
			<ContentEditor contentPackage={contentPackage} course={course} readOnly={readOnly} />
		</div>
	);
}
