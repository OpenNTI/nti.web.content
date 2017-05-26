import React from 'react';
import {ContentResources} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import Controls from '../course-common/Controls';
import {CourseEditor, CaptionEditor} from '../course-common';

import FigureEditor from './FigureEditor';

const DEFAULT_TEXT = {
	figureTitle: 'Figure %(index)s',
	descriptionPlaceholder: 'Write a caption...'
};

const editorT = scoped('nti-content.editor.block-types.course-figure.FigureEditor', DEFAULT_TEXT);

const FIGURE_REGEX = /^Figure\s\d$/;

function getFigureTitle (index) {
	return editorT('figureTitle', {index: index + 1});
}

function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}

const blockType = {
	t: editorT,
	regex: FIGURE_REGEX,
	getTitle: getFigureTitle
};

const DEFAULT_CONTROLS_TEXT = {
	change: 'Replace Image'
};

const controlsT = scoped('nti-content.editor.block-types.course-figure.Controls', DEFAULT_CONTROLS_TEXT);

export default class CourseFigureEditor extends CourseEditor {
	getStateFor (props = this.props) {
		const {block} = props;
		const data = block.getData();
		const body = data.get('body');

		return {
			url: data.get('arguments'),
			body: body.toJS ? body.toJS() : body
		};
	}


	onChange = () => {
		const {blockProps: {course, setBlockData}} = this.props;
		const accept = x => !x.isFolder && fileIsImage(x);

		ContentResources.selectFrom(course.getID(), accept)
			.then((file) => {
				if (setBlockData) {
					setBlockData({arguments: file.url});
				}
			});
	};


	onClick = (e) => {
		e.stopPropagation();

		if (this.caption) {
			this.caption.focus();
		}
	};


	render () {
		const {block, blockProps:{indexOfType}} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-figure-editor" onClick={this.onClick}>
				<Controls onRemove={this.onRemove} onChange={this.onChange} t={controlsT} />
				<FigureEditor url={url} blockId={blockId} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor
					ref={this.attachCaptionRef}
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
					indexOfType={indexOfType}
					blockType={blockType}
				/>
			</div>
		);
	}
}
