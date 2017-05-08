import React from 'react';
import PropTypes from 'prop-types';

import {ContextProvider} from '../../draft-core';
import {Buttons} from '../block-types';


BlockTypes.propTypes = {
	contentPackage: PropTypes.object,
	course: PropTypes.object,
};
export default function BlockTypes ({contentPackage, course}) {
	return (
		<ContextProvider editorId="content-editor">
			<div className="content-editor-block-types">
				{Buttons.map((button, key) => {
					return React.createElement(button, {key, contentPackage, course});
				})}
			</div>
		</ContextProvider>
	);
}
