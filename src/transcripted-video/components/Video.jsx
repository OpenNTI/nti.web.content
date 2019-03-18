import React from 'react';
import PropTypes from 'prop-types';
import {Component as Vid} from '@nti/web-video';
import classnames from 'classnames/bind';

import styles from './Video.css';
import Sticky from './Sticky';

const cx = classnames.bind(styles);

class Video extends React.Component {

	static propTypes = {
		fwdRef: PropTypes.any
	}

	render () {
		const {fwdRef, ...props} = this.props;

		return (
			<Sticky className={cx('sticky-container')}>
				<Vid ref={fwdRef} {...props} />
			</Sticky>
		);
	}
}

const FwdRef = (props, ref) => <Video {...props} fwdRef={ref} />;
export default React.forwardRef(FwdRef);
