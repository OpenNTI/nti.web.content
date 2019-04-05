import React from 'react';
import PropTypes from 'prop-types';
import {Layouts, Error, Loading} from '@nti/web-commons';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Notes} from '@nti/web-discussions';
import classnames from 'classnames/bind';

import Store from '../Store';

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
	'notes',
	'transcript',
	'currentTime',
	'onTimeUpdate',
	'notesFilter',
	'setNotesFilter'
])
class View extends React.Component {

	static deriveBindingFromProps = ({course, videoId, outlineId}) => ({
		course,
		videoId: decodeFromURI(videoId),
		outlineId: decodeFromURI(outlineId)
	})

	static propTypes = {
		course: PropTypes.object.isRequired,
		videoId: PropTypes.string.isRequired,

		// store props
		loading: PropTypes.bool,
		error: PropTypes.any,
		video: PropTypes.object,
		currentTime: PropTypes.number,
		onTimeUpdate: PropTypes.func,
		notes: PropTypes.array,
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
			currentTime,
			transcript,
			notes,
			notesFilter,
			setNotesFilter
		} = this.props;

		const showError = error && !video;
		const showLoading = loading || !video;
		const filteredNotes = notes && notesFilter ? notes.filter(notesFilter) : notes;
		const analyticsData = this.getAnalyticsData();

		return (
			<div className={cx('transcripted-video')}>
				<div className={cx('content')}>
					{
						showError
							? <Error error={error} />
							: showLoading
								? <Loading.Spinner />
								: (
									<>
										<Transcript
											transcript={transcript}
											currentTime={currentTime}
											onCueClick={this.onCueClick}
											notes={notes}
											notesFilter={notesFilter}
											setNotesFilter={setNotesFilter}
										/>
										<div className={cx('tools')}>
											<MediaViewerLink video={video} />
										</div>
										<Video src={video} onTimeUpdate={this.onTimeUpdate} ref={this.videoRef} analyticsData={analyticsData} />
									</>
								)
					}
				</div>
				<Layouts.Aside component={Notes.Sidebar} notes={filteredNotes} fillToBottom sticky />
			</div>
		);
	}
}
