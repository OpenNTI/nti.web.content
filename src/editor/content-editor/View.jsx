import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Selection, Loading, EmptyState, Errors} from 'nti-web-commons';

import Store from '../Store';
import {SET_ERROR, SAVING} from '../Constants';
import {saveContentPackageRST} from '../Actions';

import RSTEditor from './RSTEditor';
import ReadOnly from './ReadOnly';

const {Field:{Component:ErrorCmp}} = Errors;

const LOADING = Symbol('Loading');

const DEFAULT_TEXT = {
	Loading: 'Loading',
	failedHeader: 'Unable to Load Contents'
};

const t = scoped('nti-content.editor.content-editor.View', DEFAULT_TEXT);

export default class ContentEditor extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		readOnly: PropTypes.bool
	}

	setEditorRef = x => this.editorRef = x

	constructor (props) {
		super(props);

		this.state = {
			selectableID: 'content-editor',
			selectableValue: null,
			rstContents: LOADING
		};
	}


	componentDidUpdate (prevProps) {
		const {contentPackage:currentPackage} = this.props;
		const {contentPackage:oldPackage} = prevProps;

		if (oldPackage !== currentPackage) {
			this.loadContentFromPackage(currentPackage);
			this.addContentPackageListener();
			this.onMessage();
		}
	}


	componentDidMount () {
		const {contentPackage} = this.props;

		if (contentPackage) {
			this.loadContentFromPackage(contentPackage);
			this.addContentPackageListener();
		}

		Store.removeChangeListener(this.onStoreChange);
		Store.addChangeListener(this.onStoreChange);
		Store.setEditorRef(this);
		this.onMessage();
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
		Store.removeEditorRef();
		this.removeContentPackageListener();
	}


	addContentPackageListener (props = this.props) {
		const {contentPackage} = props;

		this.removeContentPackageListener(props);

		if (contentPackage) {
			contentPackage.addListener('contents-changed', this.onContentsChanged);
		}
	}


	removeContentPackageListener (props = this.props) {
		const {contentPackage} = props;

		if (contentPackage) {
			contentPackage.removeListener('contents-changed', this.onContentsChanged);
		}
	}


	loadContentFromPackage (contentPackage) {
		const {content} = this.state;

		if (!contentPackage || !contentPackage.getRSTContents) { return; }

		if (content !== LOADING) {
			this.setState({
				content: LOADING
			});
		}

		contentPackage.getRSTContents()
			.then((rstContents) => {
				this.setState({
					rstContents: rstContents.data,
					version: rstContents.version
				});
			})
			.catch(() => {
				this.setState({
					rstContents: new Error('Failed to load rst')
				});
			});
	}


	getRSTAndVersion () {
		const {version} = this.state;

		return {
			rst: this.editorRef && this.editorRef.getRST(),
			version
		};
	}


	onStoreChange = (data) => {
		const {contentPackage} = this.props;

		if (data.type === SET_ERROR && data.NTIID === contentPackage.NTIID) {
			this.onMessage();
		} else if (data.type === SAVING && !Store.isSaving && this.pendingRST) {
			this.onEditorContentChange(this.pendingRST);
			delete this.pendingRST;
		}
	}


	onContentsChanged = (newContents = {}) => {
		this.setState({
			rstContents: newContents.data || '',
			version: newContents.version || ''
		});
	}


	onMessage () {
		const {contentPackage} = this.props;
		const {NTIID} = contentPackage || {};
		const contentError = NTIID && Store.getErrorFor(NTIID, 'contents');
		const publishError = NTIID && Store.getErrorFor(NTIID, 'publish');

		this.setState({
			contentError,
			publishError
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


	onEditorChange = () => {
		const {contentError, publishError} = this.state;

		if (contentError && contentError.clear) {
			contentError.clear();
		}

		if (publishError && publishError.clear) {
			publishError.clear();
		}
	}


	onEditorContentChange = (rst) => {
		const {contentPackage} = this.props;
		const {version} = this.state;

		if (Store.isSaving) {
			this.pendingRST = rst;
		} else {
			saveContentPackageRST(contentPackage, rst, version);
		}

	}


	render () {
		const {contentPackage, course, readOnly} = this.props;
		const {selectableID, selectableValue, rstContents, contentError, publishError} = this.state;
		const error = contentError || publishError;
		const cls = cx('content-editing-editor-container', {error});

		if (readOnly) {
			return (<ReadOnly />);
		}

		return (
			<Selection.Component className={cls} id={selectableID} value={selectableValue}>
				{error && (<ErrorCmp className="content-editing-editor-error" error={error} />)}

				<div className="content">
					{rstContents === LOADING ? (
						<Loading.Mask message={t('Loading')} />
					) : rstContents instanceof Error ? (
						<EmptyState header={t('failedHeader')}/>
					) : (
						<RSTEditor
							ref={this.setEditorRef}
							contentPackage={contentPackage}
							course={course}
							value={rstContents}
							onFocus={this.onEditorFocus}
							onBlur={this.onEditorBlur}
							onChange={this.onEditorChange}
							onContentChange={this.onEditorContentChange}
						/>
					)}
				</div>
			</Selection.Component>
		);
	}
}
