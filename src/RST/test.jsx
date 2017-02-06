import React from 'react';
import {ENTITY_TYPE} from 'draft-js-utils';
import {Editor, EditorState, convertFromRaw, convertToRaw, CompositeDecorator, Entity} from 'draft-js';
import {TestRST} from './DraftStateFromRST';
import {convertRSTToDraftState, convertDraftStateToRST} from './parser';

function findLinkEntities (contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();
			return (
				entityKey !== null &&
				Entity.get(entityKey).getType() === ENTITY_TYPE.LINK
			);
		},
		callback
	);
}

Link.propTypes = {
	entityKey: React.PropTypes.string,
	children: React.PropTypes.any
};
function Link (props) {
	const {url} = Entity.get(props.entityKey).getData();

	return (
		<a href={url} style={{color: 'blue', textDecoration: 'underline'}}>
			{props.children}
		</a>
	);
}

const decorator = new CompositeDecorator([
	{
		strategy: findLinkEntities,
		component: Link
	}
]);


export default class DraftToXMLText extends React.Component {
	constructor (props) {
		super(props);

		const t = convertRSTToDraftState(TestRST);

		this.state = {
			editorState: EditorState.createWithContent(convertFromRaw(t), decorator),
			inputText: TestRST
		};
	}


	onInput = () => {
		const {inputText} = this.state;

		this.setState({
			editorState:  EditorState.createWithContent(convertFromRaw(convertRSTToDraftState(inputText)), decorator)
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
			outputText: convertDraftStateToRST(convertToRaw(editorState.getCurrentContent()))
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
