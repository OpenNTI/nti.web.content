import React from 'react';
import PropTypes from 'prop-types';

const stop = e => e.preventDefault();

PreventStealingFocus.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node
};
export default function PreventStealingFocus ({className, children}) {
	return (
		<div className={className || ''} onMouseDown={stop}>
			{children}
		</div>
	);
}
