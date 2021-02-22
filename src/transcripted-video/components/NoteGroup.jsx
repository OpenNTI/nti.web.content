import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './NoteGroup.css';

const cx = classnames.bind(styles);

export class NoteGroup extends React.Component {
	static propTypes = {
		active: PropTypes.bool,
		notes: PropTypes.array,
		onClick: PropTypes.func,
		style: PropTypes.object,
	};

	onClick = () => {
		const { notes, onClick, active } = this.props;
		onClick(notes, active);
	};

	render() {
		const { notes: { length } = [], style = {}, active } = this.props;
		return !length ? null : (
			<div
				className={cx('note-group', { active })}
				style={style}
				onClick={this.onClick}
			>
				{length}
			</div>
		);
	}
}
