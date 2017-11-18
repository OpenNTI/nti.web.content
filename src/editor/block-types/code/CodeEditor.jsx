import React from 'react';
import PropTypes from 'prop-types';

import { NestedEditorWrapper } from '../../../draft-core';

export default class CodeEditor extends React.Component {

	get code () {
		const { body } = this.props;
		debugger;
		return (body && body[0]) || '';
	}

	attachCodeRef = x => this.codeEditor = x

	focus () {
		if (this.codeEditor) {
			this.codeEditor.focus();
		}
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

	onChange = ({ target: { value }}) => {
		const { onChange } = this.props;
		debugger;
		if (onChange) {
			onChange([value]);
		}
	}

	render () {
		const { code } = this;
		return (
			<NestedEditorWrapper>
				<textarea 
					value={code} 
					ref={this.attachCodeRef}
					onChange={this.onChange} 
					onFocus={this.onFocus} 
					onBlur={this.onBlur} 
				/>
			</NestedEditorWrapper>
		);
	}
}

CodeEditor.propTypes = {
	body: PropTypes.array,
	blockId: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	indexOfType: PropTypes.number,
};
