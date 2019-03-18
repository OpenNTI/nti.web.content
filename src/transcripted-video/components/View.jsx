import React from 'react';
import PropTypes from 'prop-types';
import {Layouts, Error, Loading} from '@nti/web-commons';
import {decodeFromURI} from '@nti/lib-ntiids';
import classnames from 'classnames/bind';

import Store from '../Store';

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
		sidebar: PropTypes.any,

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
			setNotesFilter,
			sidebar: Sidebar
		} = this.props;

		const showError = error && !video;
		const showLoading = loading || !video;
		const filteredNotes = notes && notesFilter && notes.filter(notesFilter);
		const analyticsData = this.getAnalyticsData();

		return (
			<Layouts.Aside.Container className={cx('transcripted-video-container')}>
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
											<Video src={video} onTimeUpdate={this.onTimeUpdate} ref={this.videoRef} analyticsData={analyticsData} />
										</>
									)
						}
					</div>
					<Layouts.Aside component={Sidebar} notes={filteredNotes} />
				</div>
			</Layouts.Aside.Container>
		);
	}
}
