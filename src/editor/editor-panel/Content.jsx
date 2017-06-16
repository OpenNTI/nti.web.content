import PropTypes from 'prop-types';
import React from 'react';
import {Associations} from 'nti-web-commons';

import MetaEditor from '../meta-editor';
import ContentEditor from '../content-editor';

const {Sharing} = Associations;

EditorPanelContent.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object
};
export default function EditorPanelContent ({contentPackage, course}) {
	return (
		<div>
			<Sharing.Lessons item={contentPackage} scope={course} />
			<MetaEditor contentPackage={contentPackage} course={course} />
			<ContentEditor contentPackage={contentPackage} course={course} />
		</div>
	);
}
