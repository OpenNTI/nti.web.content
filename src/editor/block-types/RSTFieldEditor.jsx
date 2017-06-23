import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {Selection} from 'nti-web-commons';

import {Parser} from '../../RST';
import {Editor, Plugins, BLOCKS, STYLES, NestedEditorWrapper} from '../../draft-core';

function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
				EditorState.createWithContent(convertFromRaw(draftState)) :
				EditorState.createEmpty();
}

function draftToRST (editorState) {
	const currentContent = editorState && editorState.getCurrentContent();

	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent)) : '';
}

const plugins = [
	Plugins.LimitBlockTypes.create({allowed: new Set([BLOCKS.UNSTYLED])}),
	Plugins.LimitStyles.create({allowed: new Set([])}),
	Plugins.ExternalLinks.create(),
	Plugins.SingleLine.create()
];

export default class RSTFieldEditor extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,//A RST value
		fieldId: PropTypes.string,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func
	}


	attachEditorRef = x => this.editor = x


	constructor (props) {
		super(props);

		this.pendingSaves = [];

		this.state = this.getStateFor(props);
	}


	focus () {
		if (this.editor) {
			this.editor.focus();
		}
	}


	isPendingSave (value) {
		for (let save of this.pendingSaves) {
			if (save === value) {
				return true;
			}
		}

		return false;
	}


	cleanUpPending (value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}


	componentWillReceiveProps (nextProps) {
		const {value:newValue} = nextProps;
		const {value:oldValue} = this.props;


		if (newValue !== oldValue && !this.isPendingSave(newValue)) {
			this.setState(this.getStateFor(nextProps));
		}
	}


	getStateFor (props = this.props) {
		const {value} = props;

		return {
			editorState: rstToDraft(value)
		};
	}


	onEditorFocus = () => {
		const {onFocus} = this.props;

		this.setState({
			selectableValue: this.editor
		});

		if (onFocus) {
			onFocus();
		}
	}


	onEditorBlur = () => {
		const {onBlur} = this.props;

		this.setState({
			selectableValue: null
		});

		if (onBlur) {
			onBlur();
		}
	}

	onContentChange = (editorState) => {
		const {onChange, value:oldValue} = this.props;
		const newValue = draftToRST(editorState);

		if (onChange && newValue !== oldValue) {
			this.pendingSaves.push(newValue);
			onChange(newValue);
		}
	}


	render () {
		const {className, fieldId, ...otherProps} = this.props;
		const {editorState, selectableValue} = this.state;
		const cls = cx('rst-field-editor', className);

		delete otherProps.value;
		delete otherProps.onChange;

		return (
			<Selection.Component className={cls} value={selectableValue} id={fieldId}>
				<NestedEditorWrapper className="rst-field-nested-wrapper">
					<Editor
						ref={this.attachEditorRef}
						editorState={editorState}
						plugins={plugins}
						onFocus={this.onEditorFocus}
						onBlur={this.onEditorBlur}
						onContentChange={this.onContentChange}
						contentChangeBuffer={0}
						{...otherProps}
					/>
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}
}
