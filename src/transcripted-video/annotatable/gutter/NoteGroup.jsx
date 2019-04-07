import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './NoteGroup.css';

const cx = classnames.bind(Styles);

export default class NoteGroup extends React.Component {
	static propTypes = {
		active: PropTypes.bool,
		notes: PropTypes.array,
		top: PropTypes.number,
		onClick: PropTypes.func
	}


	onClick = () => {
		const {notes, onClick, active} = this.props;

		if (onClick) {
			onClick(notes, active);
		}
	}


	render () {
		const {notes: {length} = [], top, active} = this.props;

		if (!length) { return null; }

		const style = {top: `${Math.floor(top)}px`};

		return (
			<div className={cx('note-group', {active})} style={style} onClick={this.onClick}>{length}</div>
		);
	}
}

