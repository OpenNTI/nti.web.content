import React from 'react';
import PropTypes from 'prop-types';
import {Layouts, DateTime, Error, Loading} from '@nti/web-commons';
import {Hooks, Events} from '@nti/web-session';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Notes} from '@nti/web-discussions';
import classnames from 'classnames/bind';

import Store from '../Store';
import Annotatable from '../annotatable';

import MediaViewerLink from './MediaViewerLink';
import Transcript from './Transcript';
import Video from './Video';
import styles from './View.css';

const cx = classnames.bind(styles);

export default
@Store.connect([
	'loading',
	'error',
	'video',
	'title',
	'duration',
	'notes',
	'transcript',
	'currentTime',
	'onTimeUpdate',
	'onNoteAdded',
	'onNoteDeleted',
	'notesFilter',
	'setNotesFilter'
])
@Hooks.onEvent({
	[Events.NOTE_CREATED]: 'onNoteCreated',
	[Events.NOTE_DELETED]: 'onNoteDeleted'
})
class View extends React.Component {

	static deriveBindingFromProps = ({course, videoId, outlineId}) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId)
	})

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,
		disableNoteCreation: PropTypes.bool,

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
					text: PropTypes.string.isRequired
				})
			)
			// transcript.regions not currently used
		})
	}

	constructor (props) {
		super(props);

		this.videoRef = React.createRef();
	}


	onNoteCreated (note) {
		const {onNoteAdded} = this.props;

		if (onNoteAdded) {
			onNoteAdded(note);
		}
	}


	onNoteDeleted (note) {
		const {onNoteDeleted} = this.props;

		if (onNoteDeleted) {
			onNoteDeleted(note);
		}
	}


	getAnalyticsData () {
		const {
			course,
			videoId,
			// context,
			transcript: {
				cues,
				slides
			} = {}
		} = this.props;

		return {
			resourceId: videoId,
			rootContextId: course && course.getID ? course.getID() : void 0,
			// context: context || [],
			withTranscript: Boolean(cues || slides)
		};
	}

	onTimeUpdate = ({target: {currentTime}} = {}) => {
		const {onTimeUpdate} = this.props;
		onTimeUpdate(currentTime);
	}

	onCueClick = ({startTime} = {}) => {
		const {videoRef: {current: video}} = this;

		if (video && video.setCurrentTime) {
			video.setCurrentTime(parseFloat(startTime));
		}
	}

	render () {
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
			disableNoteCreation
		} = this.props;

		const showError = error && !video;
		const showLoading = loading || !video;
		const filteredNotes = notes && notesFilter ? notes.filter(notesFilter) : notes;
		const analyticsData = this.getAnalyticsData();

		return (
			<div className={cx('transcripted-video')}>
				<section className={cx('content')}>
					{
						showError
							? <Error error={error} />
							: showLoading
								? <Loading.Spinner />
								: (
									<>
										<Annotatable
											containerId={video.getID()}
											notes={notes}
											notesFilter={notesFilter}
											setNotesFilter={setNotesFilter}
											disableNoteCreation={disableNoteCreation}
										>
											<header className={cx('video-header')}>
												<div className={cx('tools')}>
													<MediaViewerLink video={video} />
												</div>
												<Annotatable.Anchors.Anchor className={cx('video-meta')} id={video.getID()}>
													{title && (
														<h1 className={cx('video-title')}>{title}</h1>
													)}
													{duration && (
														<span className={cx('duration')}>{DateTime.getShortNaturalDuration(duration * 1000)}</span>
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
										<Video src={video} onTimeUpdate={this.onTimeUpdate} ref={this.videoRef} analyticsData={analyticsData} />
									</>
								)
					}
				</section>
				<Layouts.Aside component={Notes.Sidebar} notes={filteredNotes} fillToBottom sticky />
			</div>
		);
	}
}
