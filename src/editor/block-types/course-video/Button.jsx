import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {EmbedInput} from 'nti-web-video';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

import {isVideoBlock} from './util';

const DEFAULT_TEXT = {
	label: 'Embed Video'
};

const t = scoped('nti-content.editor.block-types.course-figure.button', DEFAULT_TEXT);

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

		EmbedInput.show(void 0, {
			refocus: editorRef
		})
			.then(({service, source}) => {
				insertBlock({
					type: BLOCKS.ATOMIC,
					text: '',
					data: {
						name: 'ntivideo',
						body: [],
						arguments: `${service} ${source}`,
						options: {}
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
				isBlockPredicate={isVideoBlock}
			/>
		);
	};

}
