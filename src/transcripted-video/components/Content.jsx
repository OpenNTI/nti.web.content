import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decorate } from '@nti/lib-commons';
import { DateTime, Error, Loading } from '@nti/web-commons';
import { decodeFromURI } from '@nti/lib-ntiids';

import Store from '../Store';
import Annotatable from '../annotatable';

import Tools from './Tools';
import Transcript from './Transcript';
import Video from './Video';
import styles from './View.css';

const cx = classnames.bind(styles);

const PLAYER_CONFIG = 'media-modal';

class Content extends React.Component {
	static deriveBindingFromProps = ({ course, videoId, outlineId }) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId),
	});

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,
		analyticsData: PropTypes.object,
		disableNoteCreation: PropTypes.bool,
		scrolledTo: PropTypes.oneOfType([
			PropTypes.string, // note id
			PropTypes.shape({
				// model
				getID: PropTypes.func.isRequired,
			}),
		]),
		autoPlay: PropTypes.bool,
		startTime: PropTypes.number,

		// store props
		loading: PropTypes.bool,
		error: PropTypes.any,
		video: PropTypes.object,
		title: PropTypes.string,
		duration: PropTypes.number,
		currentTime: PropTypes.number,
		onTimeUpdate: PropTypes.func,
		notes: PropTypes.array,
		onNoteAdded: PropTypes.func,
		onNoteDeleted: PropTypes.func,
		notesFilter: PropTypes.func,
		setNotesFilter: PropTypes.func,
		transcript: PropTypes.shape({
			cues: PropTypes.arrayOf(
				PropTypes.shape({
					startTime: PropTypes.number.isRequired,
					endTime: PropTypes.number.isRequired,
					text: PropTypes.string.isRequired,
				})
			),
			// transcript.regions not currently used
		}),
	};

	constructor(props) {
		super(props);

		this.videoRef = React.createRef();
	}

	getAnalyticsData() {
		const {
			course,
			videoId,
			analyticsData,
			// context,
			transcript: { cues, slides } = {},
		} = this.props;

		return {
			...(analyticsData || {}),
			resourceId: videoId,
			rootContextId: course && course.getID ? course.getID() : void 0,
			// context: context || [],
			player_configuration: PLAYER_CONFIG,
			withTranscript: Boolean(cues || slides),
		};
	}

	onTimeUpdate = ({ target: { currentTime } } = {}) => {
		const { onTimeUpdate } = this.props;
		onTimeUpdate(currentTime);
	};

	onCueClick = ({ startTime } = {}) => {
		const {
			videoRef: { current: video },
		} = this;

		if (video && video.setCurrentTime) {
			video.setCurrentTime(parseFloat(startTime));
		}
	};

	render() {
		const {
			loading,
			error,
			video,
			title,
			duration,
			currentTime,
			transcript,
			notes,
			notesFilter,
			setNotesFilter,
			disableNoteCreation,
			scrolledTo,
			autoPlay,
			startTime,
		} = this.props;

		const showError = error && !video;
		const showLoading = loading || !video;
		const analyticsData = this.getAnalyticsData();

		return (
			<section className={cx('content')}>
				{showError ? (
					<Error error={error} />
				) : showLoading ? (
					<div className={cx('loading-container')}>
						<Loading.Spinner.Large />
					</div>
				) : (
					<>
						<Annotatable
							containerId={video.getID()}
							notes={notes}
							notesFilter={notesFilter}
							setNotesFilter={setNotesFilter}
							disableNoteCreation={disableNoteCreation}
							scrolledTo={scrolledTo}
						>
							<header className={cx('video-header')}>
								<Tools video={video} />
								<Annotatable.Anchors.Anchor
									className={cx('video-meta')}
									id={video.getID()}
								>
									{title && (
										<h1 className={cx('video-title')}>
											{title}
										</h1>
									)}
									{duration && (
										<span className={cx('duration')}>
											{DateTime.getShortNaturalDuration(
												duration * 1000
											)}
										</span>
									)}
								</Annotatable.Anchors.Anchor>
							</header>
							<Transcript
								video={video}
								transcript={transcript}
								currentTime={currentTime}
								onCueClick={this.onCueClick}
							/>
						</Annotatable>
						<Video
							src={video}
							onTimeUpdate={this.onTimeUpdate}
							ref={this.videoRef}
							analyticsData={analyticsData}
							autoPlay={autoPlay}
							startTime={startTime}
						/>
					</>
				)}
			</section>
		);
	}
}

export default decorate(Content, [
	Store.monitor([
		'loading',
		'error',
		'video',
		'title',
		'duration',
		'notes',
		'transcript',
		'currentTime',
		'onTimeUpdate',
		'notesFilter',
		'setNotesFilter',
	]),
]);
