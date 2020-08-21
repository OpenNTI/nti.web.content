import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {v4 as uuid} from 'uuid';
import {scoped} from '@nti/lib-locale';
import { Chooser } from '@nti/web-video';
import {BLOCKS} from '@nti/web-editor';

import Button from '../common/Button';
import {VIDEO_DELETED_EVENT, emitEvent} from '../Events';

import {isAnyVideoTypeRefBlock} from './util';

const DEFAULT_TEXT = {
	label: 'Video'
};

const t = scoped('web-content.editor.block-types.course-video-ref.button', DEFAULT_TEXT);


export default class CourseVideoButton extends React.Component {
	static propTypes = {
		course: PropTypes.object
	};

	constructor () {
		super();

		this.state = this.getStateFor(this.props);
	}

	getStateFor = () => ({});

	attachButtonRef = x => this.buttonRef = x;

	createBlock = insertBlock => {
		const editorRef = this.buttonRef
			&& this.buttonRef.editorContext
			&& this.buttonRef.editorContext.editor
			&& this.buttonRef.editorContext.editor.draftEditor;
		const { course } = this.props;
		Chooser.show(course, { refocus: editorRef },
			{
				onVideoDelete: (videoId) => {
					// handle content block modification
					emitEvent(VIDEO_DELETED_EVENT, videoId);
				}
			})
			.then(video => {
				insertBlock({
					type: BLOCKS.ATOMIC,
					text: '',
					data: {
						name: 'ntivideoref',
						body: [],
						arguments: `${video.getID()}`,
						options: {uid: uuid()}
					}
				});
			});
	};

	render = () => {
		const {course} = this.props;

		return (
			<Button
				attachPluginRef={this.attachButtonRef}
				className="course-video-button"
				iconClass="content-editor-block-types-video-button"
				label={t('label')}
				createBlock={this.createBlock}
				createBlockProps={{course}}
				isBlockPredicate={isAnyVideoTypeRefBlock}
			/>
		);
	};

}
