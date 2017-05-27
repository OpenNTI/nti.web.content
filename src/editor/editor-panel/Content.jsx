import PropTypes from 'prop-types';
import React from 'react';

import MetaEditor from '../meta-editor';
import ContentEditor from '../content-editor';

EditorPanelContent.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object
};
export default function EditorPanelContent ({contentPackage, course}) {
	return (
		<div>
			<MetaEditor contentPackage={contentPackage} course={course} />
			<ContentEditor contentPackage={contentPackage} course={course} />
		</div>
	);
}
