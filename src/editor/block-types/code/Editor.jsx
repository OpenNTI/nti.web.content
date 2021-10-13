import './Editor.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { NestedEditorWrapper } from '@nti/web-editor';

import { onFocus, onBlur, onRemove } from '../course-common';

import CodeEditor from './CodeEditor';
import Controls from './Controls';

const LANG_CLASSES = [
	'nti-select-input-option',
	'selected-option',
	'icon-chevron-down',
];

class Editor extends Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func,
		}),
	};

	attachCodeRef = x => (this.code = x);
	attachLangRef = x => (this.langSelect = x);
	onFocus = () => onFocus(this.props);
	onBlur = () => onBlur(this.props);
	onRemove = () => onRemove(this.props);

	constructor(props) {
		super(props);
		this.state = this.computeState(props);
	}

	componentDidUpdate(prevProps) {
		const { block: newBlock } = this.props;
		const { block: oldBlock } = prevProps;

		if (newBlock !== oldBlock) {
			this.setState(this.computeState());
		}
	}

	computeState(props = this.props) {
		const { block } = props;
		const data = block.getData();
		const body = data.get('body');
		return {
			language: data.get('arguments'),
			body: body && body.toJS ? body.toJS() : body.join('\n'),
		};
	}

	onCodeChange = code => {
		const {
			blockProps: { setBlockData },
		} = this.props;
		if (setBlockData) {
			setBlockData({ body: code }, true);
		}
	};

	onLanguageChange = language => {
		const {
			blockProps: { setBlockData },
		} = this.props;
		if (setBlockData) {
			setBlockData({ arguments: language }, true);
			this.code.focus();
		}
	};

	onClick = e => {
		const {
			target: { classList: targetCls },
		} = e;
		e.stopPropagation();

		if (targetCls.contains('rm-editor')) {
			this.onRemove();
		} else if (
			this.code &&
			!targetCls.contains('nti-select-input-option') &&
			!targetCls.contains('icon-chevron-down')
		) {
			this.code.focus();
		} else if (
			this.langSelect &&
			LANG_CLASSES.some(v => targetCls.contains(v))
		) {
			this.langSelect.onLabelClick();
		}
	};

	render() {
		const { body, language } = this.state;
		return (
			<NestedEditorWrapper
				tabIndex="0"
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				onClick={this.onClick}
				className="code-block-editor"
			>
				<Controls
					language={language}
					onChange={this.onLanguageChange}
					attachLangRef={this.attachLangRef}
				/>
				<CodeEditor
					ref={this.attachCodeRef}
					code={Array.isArray(body) ? '' : body}
					onChange={this.onCodeChange}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
			</NestedEditorWrapper>
		);
	}
}

export default Editor;
