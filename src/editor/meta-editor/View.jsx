import React from 'react';

import Icon from './Icon';
import Title from './Title';
import Description from './Description';

MetaEditor.propTypes = {
	contentPackage: React.PropTypes.object,
	course: React.PropTypes.object
};
export default function MetaEditor ({contentPackage, course}) {
	return (
		<div className="content-meta-editor">
			<Icon contentPackage={contentPackage} course={course} />

			<div className="wrap">
				<Title contentPackage={contentPackage} course={course} />
				<Description contentPackage={contentPackage} course={course} />
			</div>
		</div>
	);
}
