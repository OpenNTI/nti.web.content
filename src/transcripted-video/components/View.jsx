import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { decodeFromURI } from '@nti/lib-ntiids';
import { VideoContext } from '@nti/web-video';

import Store from '../Store';

import Content from './Content';
import Sidebar from './Sidebar';
import styles from './View.css';

const cx = classnames.bind(styles);

class View extends React.Component {
	static deriveBindingFromProps = ({ course, video, videoId, outlineId }) => ({
		course,
		video: video,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId),
	});

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,
		outlineId: PropTypes.string,
		analyticsData: PropTypes.object,
		disableNoteCreation: PropTypes.bool,
		autoPlay: PropTypes.bool,
		startTime: PropTypes.number,
		onNewNote: PropTypes.func,
		scrolledTo: PropTypes.oneOfType([
			PropTypes.string, // note id
			PropTypes.shape({
				// model
				getID: PropTypes.func.isRequired,
			}),
		]),
	};

	render() {
		const {
			course,
			videoId,
			outlineId,
			scrolledTo,
			disableNoteCreation,
			autoPlay,
			analyticsData,
			startTime,
			onNewNote,
		} = this.props;

		const props = {
			course,
			videoId,
			outlineId,
			onNewNote,
		};

		return (
			<VideoContext>
				<div className={cx('transcripted-video')}>
					<Content
						{...props}
						disableNoteCreation={disableNoteCreation}
						autoPlay={autoPlay}
						analyticsData={analyticsData}
						scrolledTo={scrolledTo}
						startTime={startTime}
					/>
					<Sidebar {...props} />
				</div>
			</VideoContext>
		);
	}
}

export default decorate(View, [Store.connect()]);
