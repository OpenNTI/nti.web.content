import React from 'react';
import PropTypes from 'prop-types';

const stop = e => e.preventDefault();

PreventStealingFocus.propTypes = {
	children: PropTypes.node
};
export default function PreventStealingFocus ({children, ...otherProps}) {
	return (
		<div onMouseDown={stop} {...otherProps} >
			{children}
		</div>
	);
}
