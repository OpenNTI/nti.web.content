import React from 'react';
import {scoped} from 'nti-lib-locale';
import {createMediaSourceFromUrl} from 'nti-web-video';

import Controls from '../course-common/Controls';
import {CourseEditor, CaptionEditor} from '../course-common';

import VideoEditor from './VideoEditor';

const DEFAULT_TEXT = {
	videoTitle: 'Video %(index)s',
	descriptionPlaceholder: 'Write a caption...'
};

const editorT = scoped('COURSE_VIDEO_CAPTION_EDITOR', DEFAULT_TEXT);

const blockType = {
	t: editorT,
	regex: /^Video\s\d$/,
	getTitle: index => editorT('videoTitle', {index: index + 1})
};

const defaultControlsText = {
	change: 'Replace Video'
};

const controlsT = scoped('course-figure-controls', defaultControlsText);

export default class CourseVideoEditor extends CourseEditor {
	onChange = null;

	getStateFor (props = this.props) {
		const {block} = props;
		const data = block.getData();
		const body = data.get('body');

		return {
			url: this.state && this.state.url,
			body: body.toJS ? body.toJS() : body
		};
	}


	onClick = e => {
		e.stopPropagation();

		if (this.caption) {
			this.caption.focus();
		}
	};


	updateFromMediaSource = ({service, source, href}) => {
		const {blockProps:{setBlockData}} = this.props;
		setBlockData({arguments: `${service} ${source}`});
		this.setState({url: href});
	};


	updateUrl = inputUrl => createMediaSourceFromUrl(inputUrl)
		.then(mediaSource => mediaSource && this.updateFromMediaSource(mediaSource))
		.catch(() => Function.prototype());


	render () {
		const {block, blockProps:{indexOfType}} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-video-editor">
				<Controls onRemove={this.onRemove} onChange={this.onChange} t={controlsT} />
				<VideoEditor updateUrl={this.updateUrl} url={url} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor
					ref={this.attachCaptionRef}
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
					indexOfType={indexOfType}
					blockType={blockType}
					onClick={this.onClick}
				/>
			</div>
		);
	}
}
