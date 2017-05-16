import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import RSTFieldEditor from '../RSTFieldEditor';

const DEFAULT_TEXT = {
	figureTitle: 'Figure %(index)s',
	descriptionPlaceholder: 'Write a caption...'
};

const t = scoped('COURSE_FIGURE_CAPTION_EDITOR', DEFAULT_TEXT);

const FIGURE_REGEX = /^Figure\s\d$/;


export default class CaptionEditor extends React.Component {
	static propTypes = {
		body: PropTypes.array,
		blockId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		indexOfType: PropTypes.number
	}

	state = {}

	componentWillReceiveProps (nextProps) {
		const {body:newBody, indexOfType:newIndex} = nextProps;
		const {body:oldBody, indexOfType:oldIndex} = this.props;

		if (newBody !== oldBody || newIndex !== oldIndex) {
			this.maybeFixTitle(newBody, newIndex);
		}
	}

	componentDidMount () {
		const {body, onChange, indexOfType} = this.props;

		if (!body.length) {
			onChange([t('figureTitle', {index: indexOfType})]);
		}
	}


	maybeFixTitle (body, index) {
		const {onChange} = this.props;
		const newTitle = t('figureTitle', {index});
		const oldTitle = body[0];

		if (!oldTitle || (FIGURE_REGEX.test(oldTitle) && newTitle !== oldTitle)) {
			onChange([newTitle, body[1] || '']);
		}
	}


	get title () {
		const {body} = this.props;

		return body[0] || '';
	}


	get description () {
		const {body} = this.props;

		return body[1] || '';
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
		const {onChange, indexOfType} = this.props;

		this.setState({
			emptiedTitle: !title
		}, () => {
			if (onChange) {
				onChange([title || t('figureTitle', {index: indexOfType}), this.description]);
			}
		});

	}


	onDescriptionChange = (description) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange([this.title, description]);
		}
	}


	render () {
		const {blockId, indexOfType} = this.props;
		const {emptiedTitle} = this.state;
		let {title} = this;

		if (emptiedTitle && FIGURE_REGEX.test(title)) {
			title = '';
		}

		return (
			<div className="caption-editor">
				<RSTFieldEditor
					className="title"
					value={title}
					fieldId={`${blockId}-title`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onTitleChange}
					placeholder={t('figureTitle', {index: indexOfType})}
				/>
				<RSTFieldEditor
					className="description"
					value={this.description}
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
