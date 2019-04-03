import React from 'react';
import classnames from 'classnames/bind';

import styles from './ActionWidget.css';

const cx = classnames.bind(styles);

export class ActionWidget extends React.Component {
	render () {
		return (<div className={cx('action-widget')} {...this.props}><i className="icon-discuss" /></div>);
	}
}
