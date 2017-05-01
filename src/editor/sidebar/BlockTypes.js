import React from 'react';
import PropTypes from 'prop-types';

import {Buttons} from '../block-types';

BlockTypes.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object
};
export default function BlockTypes (contentPackage, course) {
	return (
		<div className="block-types">
			{Buttons.map((button, key) => {
				return React.createElement(button, {key, contentPackage, course});
			})}
		</div>
	);
}
