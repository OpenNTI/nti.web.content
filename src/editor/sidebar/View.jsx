import React from 'react';
import PropTypes from 'prop-types';

import TabBar from './TabBar';
import BlockTypes from './BlockTypes';

ContentSidebar.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object
};
export default function ContentSidebar ({contentPackage, course}) {
	return (
		<div className="content-editor-sidebar">
			<TabBar />
			<BlockTypes contentPackage={contentPackage} course={course} />
		</div>
	);
}
