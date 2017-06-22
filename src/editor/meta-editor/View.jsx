import PropTypes from 'prop-types';
import React from 'react';
import {Associations} from 'nti-web-commons';

import Icon from './Icon';
import Title from './Title';
import Description from './Description';

const {Sharing} = Associations;

MetaEditor.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object
};
export default function MetaEditor ({contentPackage, course}) {
	return (
		<div className="content-meta-editor">
			<Icon contentPackage={contentPackage} course={course} />

			<div className="wrap">
				<Sharing.Lessons item={contentPackage} scope={course} />
				<Title contentPackage={contentPackage} course={course} />
				<Description contentPackage={contentPackage} course={course} />
			</div>
		</div>
	);
}
