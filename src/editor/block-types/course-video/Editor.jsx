import React from 'react';
import {scoped} from 'nti-lib-locale';
import {createMediaSourceFromUrl} from 'nti-web-video';

import Controls from '../course-common/Controls';
import {CourseEditor, CaptionEditor} from '../course-common';

import VideoEditor from './VideoEditor';

const defaultText = {
	videoTitle: 'Video %(index)s',
	descriptionPlaceholder: 'Write a caption...'
};
const editorT = scoped('COURSE_VIDEO_CAPTION_EDITOR', defaultText);
const regex = /^Video\s\d$/;
const getTitle = index => editorT('videoTitle', {index: index + 1});

const blockType = {
	t: editorT,
	regex,
	getTitle
}

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


	render () {
		const {block, blockProps:{indexOfType, setBlockData}} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();
		const updateUrl = inputUrl => {
			createMediaSourceFromUrl(inputUrl).then(({service, source, href}) => {
				setBlockData({arguments: `${service} ${source}`});
				this.setState({url: href});
			});
		};

		return (
			<div className="course-video-editor">
				<Controls onRemove={this.onRemove} onChange={this.onChange} t={controlsT} />
				<VideoEditor updateUrl={updateUrl} url={url} onFocus={this.onFocus} onBlur={this.onBlur} />
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
