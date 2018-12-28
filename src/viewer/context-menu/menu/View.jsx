import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Highlight from './Highlight';
import Definition from './Definition';
import Note from './Note';

export default class ContextMenuItems extends React.Component {
	static propTypes = {
		mouse: PropTypes.bool,
		touch: PropTypes.bool
	}

	render () {
		const {mouse, touch, ...otherProps} = this.props;

		return (
			<div className={cx('nti-content-context-menu', {mouse, touch})}>
				<Highlight {...otherProps} />
				<Definition {...otherProps} />
				<Note {...otherProps} />
			</div>
		);
	}
}
