import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import TranscriptChunk from './TranscriptChunk';
import styles from './Transcript.css';

const cx = classnames.bind(styles);
const t = scoped('transcripted-video.transcript', {
	title: 'Transcript',
});

// threshold between transcript cues at which we create a new chunk/paragraph
const MAXIMUM_PAUSE_SECONDS = 1.5;

// group cues into chunks according to pauses longer than the specified threshold,
// and/or such that a chunk is no longer than the specified chunk duration
const chunkCues = (
	cues,
	maxChunkDurationSeconds = 3600,
	maxGap = MAXIMUM_PAUSE_SECONDS
) =>
	cues.reduce((chunks, cue) => {
		const { startTime, endTime } = cue;
		const currentChunk = chunks[chunks.length - 1] || {};
		const { startTime: currentChunkStart } = currentChunk;
		const prevCue = (currentChunk.cues || []).slice(-1)[0];
		const gap = startTime - (prevCue ? prevCue.endTime : startTime);

		if (
			currentChunkStart == null ||
			startTime > currentChunkStart + maxChunkDurationSeconds ||
			gap > maxGap
		) {
			chunks.push({
				startTime,
				endTime,
				cues: [cue],
			});
		} else {
			currentChunk.cues.push(cue);
			currentChunk.endTime = endTime;
		}

		return chunks;
	}, []);

export default class Transcript extends React.Component {
	static propTypes = {
		transcript: PropTypes.shape({
			cues: PropTypes.arrayOf(
				PropTypes.shape({
					startTime: PropTypes.number.isRequired,
					endTime: PropTypes.number.isRequired,
					text: PropTypes.string.isRequired,
				})
			),
			slides: PropTypes.arrayOf(
				PropTypes.shape({
					startTime: PropTypes.number.isRequired,
					endTime: PropTypes.number.isRequired,
					image: PropTypes.string.isRequired,
				})
			),
			// transcript.regions not currently used
		}),
		currentTime: PropTypes.number,
		onCueClick: PropTypes.func,
		video: PropTypes.object,
	};

	// for tuning/testing the maximum pause allowed within a transcript "chunk"
	// state = {}
	// onGapChange = ({target: {value}}) => this.setState({maxPause: value})

	onCueClick = cue => {
		const { onCueClick } = this.props;

		if (onCueClick) {
			onCueClick(cue);
		}
	};

	renderChunk = ({ startTime, endTime, cues }) => {
		const { currentTime, video } = this.props;

		return (
			<TranscriptChunk
				video={video}
				key={startTime}
				start={startTime}
				end={endTime}
				cues={cues}
				onCueClick={this.onCueClick}
				currentTime={currentTime}
			/>
		);
	};

	render() {
		const {
			props: { transcript: { cues = [], slides = [] } = {} },
		} = this;

		if (!cues.length && !slides.length) {
			return null;
		}

		const items = [...cues, ...slides]
			.filter(Boolean)
			.sort((a, b) => a.startTime - b.startTime);

		const chunks = chunkCues(items);

		return (
			<section className={cx('transcript')}>
				<h1 className={cx('title')}>{t('title')}</h1>
				<ol className={cx('chunks')}>{chunks.map(this.renderChunk)}</ol>
			</section>
		);
	}
}

/* slider for tuning/testing the maximum pause within a transcript "chunk"
	<div>
		<div>Max pause length in seconds: {maxPause}</div>
		<input type="range" min="0.2" max="3" step="0.1" value={maxPause} onChange={this.onGapChange} />
	</div>
*/
