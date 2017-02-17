import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Selection, Loading, EmptyState} from 'nti-web-commons';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {buffer} from 'nti-commons';

import {Editor} from '../../draft-core';
import {Parser} from '../../RST';
import {saveContentPackageRST} from '../Actions';


const LOADING = Symbol('Loading');

const DEFAULT_TEXT = {
	Loading: 'Loading',
	failedHeader: 'Unable to Load Contents'
};

const t = scoped('CONTENT_EDITING_EDITOR', DEFAULT_TEXT);

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		this.onChangeBuffered = buffer(500, () => this.onChange());

		this.state = {
			selectableID: 'content-editor',
			selectableValue: null,
			contents: LOADING
		};
	}


	componentDidUpdate (prevProps) {
		const {contentPackage:currentPackage} = this.props;
		const {contentPackage:oldPackage} = prevProps;

		if (oldPackage !== currentPackage) {
			this.loadContentFromPackage(currentPackage);
		}
	}


	componentDidMount () {
		const {contentPackage} = this.props;

		if (contentPackage) {
			this.loadContentFromPackage(contentPackage);
		}
	}


	loadContentFromPackage (contentPackage) {
		const {content} = this.state;

		if (content !== LOADING) {
			this.setState({
				content: LOADING
			});
		}

		contentPackage.getContents()
			.then((rst) => {
				const draftState = rst && Parser.convertRSTToDraftState(rst);
				const contents = draftState ? EditorState.createWithContent(convertFromRaw(draftState)) : EditorState.createEmpty();

				this.setState({contents, rst});
			})
			.catch(() => {
				this.setState({
					contents: new Error('Failed to load contents')
				});
			});
	}


	onChange = () => {
		if (!this.pendingState) { return; }

		const {contentPackage} = this.props;
		const {rst:oldRST} = this.state;
		const newRST = Parser.convertDraftStateToRST(convertToRaw(this.pendingState.getCurrentContent()));

		//TODO: look into how expensive this actually is for larger strings
		if (oldRST !== newRST) {
			saveContentPackageRST(contentPackage, newRST);
		}
	}


	flushChanges = () =>{
		this.onChangeBuffered.flush();
	}


	onEditorFocus = (editor) => {
		const {selectableValue} = this.state;

		if (selectableValue !== editor) {
			this.setState({
				selectableValue: editor
			});
		}
	}


	onEditorBlur = () => {
		this.flushChanges();
	}


	onEditorChange = (newState) => {
		this.pendingState = newState;

		this.onChangeBuffered();
	}


	render () {
		const {selectableID, selectableValue, contents} = this.state;

		return (
			<Selection.Component className="content-editing-editor-container" id={selectableID} value={selectableValue}>
				{contents === LOADING ?
						(<Loading.Mask message={t('Loading')} />) :
						contents instanceof Error ?
							(<EmptyState header={t('failedHeader')}/>) :
							(<Editor
								className="content-editing-editor"
								onFocus={this.onEditorFocus}
								onBlur={this.onEditorBlur}
								editorState={contents}
								onChange={this.onEditorChange}
							/>)
				}
			</Selection.Component>
		);
	}
}
