import React from 'react';
import PropTypes from 'prop-types';
import {Component as Vid} from '@nti/web-video';
import classnames from 'classnames/bind';

import StickyOffsetMonitor from './StickyOffsetMonitor';
import styles from './Video.css';

const cx = classnames.bind(styles);

export default class Video extends React.Component {

	// state = {}

	// onOffsetChange = (pct, e) => {
	// 	this.setState({pct});
	// }

	static propTypes = {
		pct: PropTypes.number
	}
	
	render () {
		const {pct = 1} = this.props;

		const props = {
			...this.props,
			style: {
				animationDelay: `-${1 - pct}s`
			},
			containerProps: {
				className: cx('sticky-container'),
			}
		};

		return (
			<StickyVideo {...props} />
		);
	}
}

@StickyOffsetMonitor
class StickyVideo extends React.Component {

	static propTypes = {
		fwdRef: PropTypes.any
	}

	render () {
		const {fwdRef, ...props} = this.props;
		
		return (
			<Vid ref={fwdRef} {...props} />
		);
	}
}
