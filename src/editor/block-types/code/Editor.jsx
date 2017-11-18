import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
	onFocus,
	onBlur,
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

	attachCodeRef = x => this.code = x

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
			body: (body && body.toJS) ? body.toJS() : body
		};
	}

	onFocus = () => onFocus(this.props);
	onBlur = () => onBlur(this.props);

	onClick = (e) => {
		e.stopProagation();
		if (this.code) {
			this.code.focus();
		}
	}

	onCodeChange = (body) => {
		const { blockProps: { setBlockData } } = this.props;
		if (setBlockData) {
			setBlockData({ body });
		}
	}

	render () {
		const { block } = this.props;
		const { body, language } = this.state;
		const blockId = block.getKey();

		return (
			<div className="code-block-editor">
				<Controls language={language} onChange={this.onChange} />
				<CodeEditor 
					ref={this.attachCodeRef} 
					body={body} 
					blockId={blockId}
					onFocus={this.onFocus} 
					onBlur={this.onBlur} 
					onChange={this.onCodeChange}
				/>
			</div>
		);
	}
}

export default Editor;
