import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {LinkTo} from '@nti/web-routing';

import styles from './ActionWidget.css';

const cx = classnames.bind(styles);

function buildApplicableRange (actionInfo) {
	const {videoId, time} = actionInfo || {};

	if (!time) { return {Class: 'ContentRangeDescription'}; }

	return {
		Class: 'TimeRangeDescription',
		MimeType: 'application/vnd.nextthought.contentrange.timerangedescription',
		seriesId: videoId,
		start: {
			role: 'start',
			seconds: time.start * 1000,
			Class: 'TimeContentPointer',
			MimeType: 'application/vnd.nextthought.contentrange.timecontentpointer'
		},
		end: {
			role: 'end',
			seconds: time.end * 1000,
			Class: 'TimeContentPointer',
			MimeType: 'application/vnd.nextthought.contentrange.timecontentpointer'
		}
	};
}

function buildMockNote (actionInfo, yForTime) {
	const {videoId} = actionInfo || {};

	if (!videoId) { return null; }

	return {
		MimeType: 'application/vnd.nextthought.note',
		isNote: true,
		NTIID: null,
		body: null,
		title: '',
		ContainerId: videoId,
		applicableRange: buildApplicableRange(actionInfo),
		selectedText: '',
		getYPositionInTranscript: () => {
			const {time: {start} = {}} = actionInfo;

			if (start != null) {
				return yForTime(start);
			}

			return 0;
		}
	};
}

export class ActionWidget extends React.Component {
	static propTypes = {
		actionInfo: PropTypes.object,
		yForTime: PropTypes.func
	}

	render () {
		const {actionInfo, yForTime, ...otherProps} = this.props;

		return (
			<LinkTo.Object object={buildMockNote(actionInfo, yForTime)} className={cx('action-widget')} {...otherProps}>
				<i className="icon-discuss" />
			</LinkTo.Object>
		);
	}
}
