import React from 'react';
import PropTypes from 'prop-types';
import {Layouts} from '@nti/web-commons';
import classnames from 'classnames/bind';

import VideoView from '../../../src/transcripted-video';

import Sidebar from './Sidebar';
import styles from './TranscriptedVideoTest.css';

const cx = classnames.bind(styles);

export default class TranscriptedVideo extends React.Component {

	static propTypes = {
		course: PropTypes.object,
		outlineId: PropTypes.string,
		videoId: PropTypes.string
	}

	render () {
		const {course, outlineId, videoId} = this.props;
		return !course || !videoId ? null : (
			<Layouts.Aside.Container className={cx('transcripted-video-test-container')}>
				<VideoView course={course} outlineId={outlineId} videoId={videoId} sidebar={Sidebar}/>
			</Layouts.Aside.Container>
		);
	}
}
