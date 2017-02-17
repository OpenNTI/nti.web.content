import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Selection, Loading, EmptyState, Errors} from 'nti-web-commons';

import Store from '../Store';
import {SET_ERROR} from '../Constants';
import {saveContentPackageRST} from '../Actions';

import RSTEditor from './RSTEditor';

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

		contentPackage.getRSTContents()
			.then((rstContents) => {
				this.setState({rstContents});
			})
			.catch(() => {
				this.setState({
					rstContents: new Error('Failed to load rst')
				});
			});
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


	onEditorChange = () => {
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}
	}


	onEditorContentChange = (rst) => {
		const {contentPackage} = this.props;

		saveContentPackageRST(contentPackage, rst);
	}


	render () {
		const {selectableID, selectableValue, rstContents, error} = this.state;
		const cls = cx('content-editing-editor-container', {error});

		return (
			<Selection.Component className={cls} id={selectableID} value={selectableValue}>
				{error && (<ErrorCmp className="content-editing-editor-error" error={error} />)}

				{rstContents === LOADING ?
						(<Loading.Mask message={t('Loading')} />) :
						rstContents instanceof Error ?
							(<EmptyState header={t('failedHeader')}/>) :
							(<RSTEditor
								value={rstContents}
								onFocus={this.onEditorFocus}
								onBlur={this.onEditorBlur}
								onChange={this.onEditorChange}
								onContentChange={this.onEditorContentChange}
							/>)
				}
			</Selection.Component>
		);
	}
}
