import React from 'react';
import PropTypes from 'prop-types';

import Anchor from './Anchor';

export default class TimeAnchor extends React.Component {
	static isTimeAnchor (node) {
		return node && node.dataset && node.dataset.timeAnchor;
	}

	static getAnchorInfo (node) {
		if (!TimeAnchor.isTimeAnchor(node)) { return null; }

		const {anchorStartTime: start, anchorEndTime: end} = node.dataset;

		return {
			isTimeAnchor: true,
			startTime: start && parseFloat(start, 10),
			endTime: end && parseFloat(end, 10)
		};
	}

	static propTypes = {
		startTime: PropTypes.number,
		endTime: PropTypes.number
	}

	render () {
		const {startTime, endTime, ...otherProps} = this.props;
		const timeProps = {
			'data-time-anchor': true
		};

		if (startTime) {
			timeProps['data-anchor-start-time'] = startTime.toFixed(3);
		}

		if (endTime) {
			timeProps['data-anchor-end-time'] = endTime.toFixed(3);
		}

		return (
			<Anchor {...otherProps} {...timeProps} />
		);
	}
}
