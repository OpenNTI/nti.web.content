import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Selection, Loading, EmptyState, Errors} from 'nti-web-commons';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {buffer} from 'nti-commons';

import {Editor} from '../../draft-core';
import {Parser} from '../../RST';

import Store from '../Store';
import {SET_ERROR} from '../Constants';
import {saveContentPackageRST} from '../Actions';

const {Field:{Component:ErrorCmp}} = Errors;

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
			this.onMessage();
		}
	}


	componentDidMount () {
		const {contentPackage} = this.props;

		if (contentPackage) {
			this.loadContentFromPackage(contentPackage);
		}

		Store.removeChangeListener(this.onStoreChange);
		Store.addChangeListener(this.onStoreChange);
		this.onMessage();
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
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

		//TODO: look into how expensive this comparison actually is for larger strings
		if (oldRST !== newRST) {
			saveContentPackageRST(contentPackage, newRST);
		}
	}


	flushChanges = () =>{
		this.onChangeBuffered.flush();
	}


	onStoreChange = (data) => {
		const {contentPackage} = this.props;

		if (data.type === SET_ERROR && data.NTIID === contentPackage.NTIID) {
			this.onMessage();
		}
	}


	onMessage () {
		const {contentPackage} = this.props;
		const {NTIID} = contentPackage || {};
		const error = NTIID && Store.getErrorFor(NTIID, 'contents');

		this.setState({
			error
		});
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
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}

		this.pendingState = newState;

		this.onChangeBuffered();
	}


	render () {
		const {selectableID, selectableValue, contents, error} = this.state;
		const cls = cx('content-editing-editor-container', {error});

		return (
			<Selection.Component className={cls} id={selectableID} value={selectableValue}>
				{error && (<ErrorCmp className="content-editing-editor-error" error={error} />)}

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
