import './CodeEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

const { TextArea } = Input;

export default class CodeEditor extends React.Component {

	static propTypes = {
		code: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		onFocus: PropTypes.func.isRequired,
		onBlur: PropTypes.func.isRequired,
		indexOfType: PropTypes.number
	}

	constructor (props) {
		super(props);
		this.state = {
			code: props.code || ''
		};
	}

	attachCodeRef = x => this.codeEditor = x

	componentWillReceiveProps (nextProps) {
		if (nextProps.code !== this.props.code && nextProps.code !== this.state.code) {
			this.setState({
				code: nextProps.code
			});
		}
	}

	focus = () => {
		if (this.codeEditor) {
			this.codeEditor.focus();
		}
	}

	onChange = (value) => {
		const { onChange } = this.props;

		onChange(value.split('\n'));
		this.setState({
			code: value
		});
	}

	render () {
		const { code } = this.state;
		const { onFocus, onBlur } = this.props;

		return (
			<TextArea
				value={code}
				onClick={this.focus}
				ref={this.attachCodeRef}
				onChange={this.onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				autoGrow
			/>
		);
	}
}
