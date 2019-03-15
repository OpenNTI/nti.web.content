import React from 'react';
import classnames from 'classnames/bind';

import CourseChooser from './CourseChooser';
import MediaChooser from './MediaChooser';
import OutlineNodeChooser from './OutlineNodeChooser';
import TranscriptedVideoTest from './TranscriptedVideoTest';
import styles from './View.css';

const cx = classnames.bind(styles);

export default class View extends React.Component {

	state = {}

	onCourseChange = course => this.setState({course, error: null})
	onCourseChangeError = error => this.setState({error})
	onMediaSelect = video => this.setState({video})
	onOutlineSelect = node => this.setState({node})
	onToggleControls = () => this.setState({controlsVisible: !this.state.controlsVisible})

	render () {
		const {course, node, video, controlsVisible: visible} = this.state;
		const outlineId = node && node.getID();
		const videoId = video && video.getID();

		return (
			<div className={cx('container')}>
				<div>
					<div onClick={this.onToggleControls}>Toggle Controls</div>
					<div className={cx('controls', {visible})}>
						<CourseChooser course={course} onChange={this.onCourseChange} onError={this.onCourseChangeError}/>
						<OutlineNodeChooser course={course} onChange={this.onOutlineSelect} />
						<MediaChooser course={course} onChange={this.onMediaSelect} />
					</div>
				</div>
				<TranscriptedVideoTest course={course} outlineId={outlineId} videoId={videoId} />
			</div>
		);
	}
}

