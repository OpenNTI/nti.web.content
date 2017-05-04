import React from 'react';
import PropTypes from 'prop-types';

import RSTFieldEditor from '../RSTFieldEditor';

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
				/>
				<RSTFieldEditor
					className="description"
					value={body[1] || ''}
					fieldId={`${blockId}-description`}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onDescriptionChange}
				/>
			</div>
		);
	}
}
