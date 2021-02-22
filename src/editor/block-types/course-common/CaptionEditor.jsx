import React from 'react';
import PropTypes from 'prop-types';

import RSTFieldEditor from '../RSTFieldEditor';

export default class CaptionEditor extends React.Component {
	static propTypes = {
		body: PropTypes.array,
		blockId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		indexOfType: PropTypes.number,
		blockType: PropTypes.shape({
			getString: PropTypes.func.isRequired,
			regex: PropTypes.instanceOf(RegExp).isRequired,
			getTitle: PropTypes.func.isRequired,
		}).isRequired,
	};

	attachTitleRef = x => (this.titleEditor = x);

	state = {};

	focus() {
		if (this.titleEditor) {
			this.titleEditor.focus();
		}
	}

	componentDidUpdate(prevProps) {
		const { body: newBody, indexOfType: newIndex } = this.props;
		const { body: oldBody, indexOfType: oldIndex } = prevProps;

		if (newBody !== oldBody || newIndex !== oldIndex) {
			this.maybeFixTitle(newBody, newIndex);
		}
	}

	componentDidMount() {
		const { body, onChange, indexOfType, blockType } = this.props;

		if (!body.length) {
			onChange([blockType.getTitle(indexOfType)]);
		}
	}

	maybeFixTitle(body, index) {
		const { onChange, blockType } = this.props;
		const newTitle = blockType.getTitle(index);
		const oldTitle = body[0];

		if (
			!oldTitle ||
			(blockType.regex.test(oldTitle) && newTitle !== oldTitle)
		) {
			onChange([newTitle, body[1] || '']);
		}
	}

	get title() {
		const { body } = this.props;

		return body[0] || '';
	}

	get description() {
		const { body } = this.props;

		return body[1] || '';
	}

	onChange = () => {
		//TODO: fill this out
	};

	onFocus = () => {
		const { onFocus } = this.props;

		if (onFocus) {
			onFocus();
		}
	};

	onBlur = () => {
		const { onBlur } = this.props;

		if (onBlur) {
			onBlur();
		}
	};

	onTitleChange = title => {
		const { onChange } = this.props;

		this.emptiedTitle = !title;

		if (onChange) {
			onChange([title, this.description], true);
		}
	};

	onDescriptionChange = description => {
		const { onChange } = this.props;

		if (onChange) {
			onChange([this.title, description], true);
		}
	};

	render() {
		const { blockId, indexOfType, blockType } = this.props;
		let { title, emptiedTitle } = this;

		if (emptiedTitle && blockType.regex.test(title)) {
			title = '';
		}

		return (
			<div className="caption-editor">
				<RSTFieldEditor
					ref={this.attachTitleRef}
					className="title"
					value={title}
					fieldId={`${blockId}-title`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onTitleChange}
					placeholder={blockType.getTitle(indexOfType)}
				/>
				<RSTFieldEditor
					className="description"
					value={this.description}
					fieldId={`${blockId}-description`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onDescriptionChange}
					placeholder={blockType.getString(
						'Editor.descriptionPlaceholder'
					)}
				/>
			</div>
		);
	}
}
