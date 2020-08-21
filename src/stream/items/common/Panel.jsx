import './Panel.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

Panel.propTypes = {
	className: PropTypes.string
};

export default function Panel ({className, ...props}) {
	return (
		<div className={cx('nti-content-stream-panel', className)} {...props} />
	);
}
