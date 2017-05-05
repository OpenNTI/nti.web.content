import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import RSTFieldEditor from '../RSTFieldEditor';

const DEFAULT_TEXT = {
	titlePlaceholder: 'Title',
	descriptionPlaceholder: 'Write a caption...'
};

const t = scoped('COURSE_FIGURE_CAPTION_EDITOR', DEFAULT_TEXT);

export default class CaptionEditor extends React.Component {
	static propTypes = {
		body: PropTypes.array,
		blockId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func
	}


	onChange = () => {
		//TODO: fill this out
	}


	onFocus = () => {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus();
		}
	}


	onBlur = () => {
		const {onBlur} = this.props;

		if (onBlur) {
			onBlur();
		}
	}


	onTitleChange = (title) => {
		const {body, onChange} = this.props;

		if (onChange) {
			onChange([title, body[1]]);
		}
	}


	onDescriptionChange = (description) => {
		const {body, onChange} = this.props;

		if (onChange) {
			onChange([body[0], description]);
		}
	}


	render () {
		const {body, blockId} = this.props;

		return (
			<div className="caption-editor">
				<RSTFieldEditor
					className="title"
					value={body[0] || ''}
					fieldId={`${blockId}-title`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onTitleChange}
					placeholder={t('titlePlaceholder')}
				/>
				<RSTFieldEditor
					className="description"
					value={body[1] || ''}
					fieldId={`${blockId}-description`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onDescriptionChange}
					placeholder={t('descriptionPlaceholder')}
				/>
			</div>
		);
	}
}
