import React from 'react';
import {Editor, EditorState} from 'draft-js';
import parseXML, {TestXML} from './DraftStateFromXML';
import parseDraftState from './XMLFromDraftState';
import parseRST, {TestRST} from './DraftStateFromRST';

import {convertRSTToDraftState} from './parser';


export default class DraftToXMLText extends React.Component {
	constructor (props) {
		super(props);

		convertRSTToDraftState(TestRST);

		this.state = {
			editorState: EditorState.createWithContent(parseXML(TestXML)),
			inputText: TestXML
		};
	}


	onInput = () => {
		const {inputText} = this.state;

		this.setState({
			editorState:  EditorState.createWithContent(parseXML(inputText))
		});
	}


	onInputChange = (e) => {
		this.setState({
			inputText: e.target.value
		});
	}


	onEditorstate = (editorState) => {
		this.setState({
			editorState
		});
	}


	onOutput = () => {
		const {editorState} = this.state;

		this.setState({
			outputText: parseDraftState(editorState.getCurrentContent())
		});
	}


	render () {
		const {inputText, editorState, outputText} = this.state;

		return (
			<div className="test-rst">
				<div className="input section">
					<span>Input:</span>
					<textarea onChange={this.onInputChange} value={inputText} />
					<button onClick={this.onInput}>Add Input</button>
				</div>
				<div className="editor section">
					<span>Draft:</span>
					<Editor editorState={editorState} onChange={this.onEditorState} />
				</div>
				<div className="output section">
					<button onClick={this.onOutput}>Show Output</button>
					<span>Output:</span>
					<textarea value={outputText} />
				</div>
			</div>
		);
	}
}
