import React from 'react';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';

import {Editor, Plugins} from '../../draft-core';
import {Parser} from '../../RST';

const externalLinks = Plugins.createExternalLinks();

const plugins = [
	externalLinks
];

function rstToEditorState (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);

	return draftState ? EditorState.createWithContent(convertFromRaw(draftState)) : EditorState.createEmpty();
}

function editorStateToRST (editorState) {
	const currentContent = editorState && editorState.getCurrentContent();

	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent)) : '';
}

export default class RSTEditor extends React.Component {
	static propTypes = {
		value: React.PropTypes.string,
		onContentChange: React.PropTypes.func
	}


	constructor (props) {
		super(props);
		this.setUpValue(props);
	}


	componentWillReceiveProps (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:oldValue} = this.props;

		if (nextValue !== oldValue) {
			this.setUpValue(nextProps);
		}
	}


	setUpValue (props = this.props) {
		const {value} = props;
		const editorState = rstToEditorState(value);
		const state = {editorState};

		if (this.state) {
			this.setState(state);
		} else {
			this.state = state;
		}
	}


	onContentChange = (editorState) => {
		const {value:oldValue, onContentChange} = this.props;
		const newValue = editorStateToRST(editorState);

		if (oldValue !== newValue) {
			// onContentChange(newValue);
		}
	}


	render () {
		const otherProps = {...this.props};
		const {editorState} = this.state;

		delete otherProps.onContentChange;
		delete otherProps.value;

		return (
			<Editor
				className="content-editing-rst-editor"
				editorState={editorState}
				onContentChange={this.onContentChange}
				plugins={plugins}
				{...otherProps}
			/>
		);
	}
}
