import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { NestedEditorWrapper } from '../../../draft-core';
import {
	onFocus,
	onBlur,
	onRemove
} from '../course-common';

import CodeEditor from './CodeEditor';
import Controls from './Controls';

class Editor extends Component {

	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func
		})
	}

	attachCodeRef = x => this.code = x;
	onFocus = () => onFocus(this.props);
	onBlur = () => onBlur(this.props);
	onRemove = () => onRemove(this.props);
	
	constructor (props) {
		super(props);
		this.state = this.getStateFor(props);
	}
	
	componentWillReceiveProps (nextProps) {
		const { block: newBlock } = nextProps;
		const { block: oldBlock } = this.props;

		if (newBlock !== oldBlock) {
			this.setState(this.getStateFor(nextProps));
		}
	}

	getStateFor (props = this.props) {
		const { block } = props;
		const data = block.getData();
		const body = data.get('body');
		return {
			language: data.get('arguments'),
			body: (body && body.toJS) ? body.toJS() : body.join('\n')
		};
	}

	onCodeChange = (code) => {
		const { blockProps: { setBlockData } } = this.props;
		if (setBlockData) {
			setBlockData({ body: code }, true);
		}
	}

	onLanguageChange = (language) => {
		const { blockProps: { setBlockData } } = this.props;
		if (setBlockData) {
			setBlockData({ arguments: language });
		}
	}

	onClick = (e) => {
		const { target: { classList: targetCls } } = e;
		e.stopPropagation();

		if (targetCls.contains('rm-editor')) {
			this.onRemove();
		} else if (this.code && !targetCls.contains('code-language')) {
			this.code.focus();
		}
	}

	render () {
		const { body, language } = this.state;

		return (
			<NestedEditorWrapper tabIndex="0" onBlur={this.onBlur} onFocus={this.onFocus} className="code-block-editor" onClick={this.onClick}>
				<Controls language={language} onChange={this.onLanguageChange} />
				<CodeEditor
					ref={this.attachCodeRef}
					code={body}
					onChange={this.onCodeChange}
				/>
			</NestedEditorWrapper>
		);
	}
}

export default Editor;
