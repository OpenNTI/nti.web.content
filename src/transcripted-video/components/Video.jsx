import React from 'react';
import PropTypes from 'prop-types';
import { Component as Vid } from '@nti/web-video';
import classnames from 'classnames/bind';

import styles from './Video.css';
import Sticky from './Sticky';

const cx = classnames.bind(styles);

const isEdge = () => !!document.querySelector('.is-edge');

// NTI-7705 - We're changing the animation-delay css value to achive the shrink-on-scroll effect,
// it has no effect in Edge because Edge snapshots all of the animation values up front. Toggling
// the animation name back and forth between identical @keyframe declarations forces it to refresh.
// I don't like it either, but here we are.
const edgeAnimationHack = () =>
	!isEdge()
		? null
		: () => {
				edgeAnimationHack.state =
					((edgeAnimationHack.state || 0) + 1) % 2;
				return {
					animationName: cx(
						edgeAnimationHack.state
							? 'sticky-video'
							: 'sticky-video-dupe'
					),
				};
		  };

class Video extends React.Component {
	static propTypes = {
		fwdRef: PropTypes.any,
	};

	render() {
		const { fwdRef, ...props } = this.props;

		return (
			<Sticky
				className={cx('sticky-container')}
				edgeAnimationHack={edgeAnimationHack()}
			>
				<Vid ref={fwdRef} {...props} />
			</Sticky>
		);
	}
}

const FwdRef = (props, ref) => <Video {...props} fwdRef={ref} />;
export default React.forwardRef(FwdRef);
