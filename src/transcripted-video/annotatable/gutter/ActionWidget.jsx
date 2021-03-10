import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { LinkTo } from '@nti/web-routing';

import Styles from './ActionWidget.css';

const cx = classnames.bind(Styles);

function buildApplicableRange(info, containerId) {
	if (!info.isTimeAnchor) {
		return { Class: 'ContentRangeDescription' };
	}

	return {
		Class: 'TimeRangeDescription',
		MimeType:
			'application/vnd.nextthought.contentrange.timerangedescription',
		seriesId: containerId,
		start: {
			role: 'start',
			seconds: info.startTime * 1000,
			Class: 'TimeContentPointer',
			MimeType:
				'application/vnd.nextthought.contentrange.timecontentpointer',
		},
		end: {
			role: 'end',
			seconds: info.endTime * 1000,
			Class: 'TimeContentPointer',
			MimeType:
				'application/vnd.nextthought.contentrange.timecontentpointer',
		},
	};
}

function buildNewNote(info, containerId) {
	return {
		MimeType: 'application/vnd.nextthought.note',
		isNote: true,
		NTIID: null,
		body: null,
		title: '',
		selectedText: '',
		ContainerId: info.id || containerId,
		applicableRange: buildApplicableRange(info, containerId),
	};
}

export default class ActionWidget extends React.Component {
	static propTypes = {
		containerId: PropTypes.string,
		activeAnchor: PropTypes.object,
	};

	render() {
		const { activeAnchor, containerId } = this.props;
		const { top } = activeAnchor;
		const style = { top: `${Math.floor(top)}px` };
		const newNote = buildNewNote(activeAnchor.info, containerId);

		return (
			<LinkTo.Object
				className={cx('action-widget')}
				object={newNote}
				style={style}
			>
				<i className="icon-discuss" />
			</LinkTo.Object>
		);
	}
}
