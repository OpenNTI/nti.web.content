import React from 'react';
import {Editor, EditorState} from 'draft-js';
import parseXML, {TestXML} from './DraftStateFromXML';
import parseDraftState from './XMLFromDraftState';


export default class DraftToXMLText extends React.Component {
	constructor (props) {
		super(props);

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


	onInputChange = (inputText) => {
		this.setState({
			inputText
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
			<div>
				<div className="input">
					<div><button onClick={this.onInput}>Add Input</button></div>
					<textarea onChange={this.onInputChange} value={inputText} />
				</div>
				<Editor editorState={editorState} onChange={this.onEditorState} />
				<div className="output">
					<div><button onClick={this.onOutput}>Show Output</button></div>
					<textarea value={outputText} />
				</div>
			</div>
		);
	}
}
