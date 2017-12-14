import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {Selection, Errors} from 'nti-web-commons';
import {PlaintextEditor} from 'nti-web-editor';

import Store from '../Store';
import {SET_ERROR} from '../Constants';

const {Field:{Component:ErrorCmp}} = Errors;

export default class ContentMetaEditor extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		className: PropTypes.string,
		fieldName: PropTypes.string,
		onChange: PropTypes.func,
		readOnly: PropTypes.bool
	}

	constructor (props) {
		super(props);

		const {fieldName} = props;

		this.state = {
			selectableID: fieldName,
			selectableValue: null
		};
	}


	componentDidMount () {
		Store.removeChangeListener(this.onStoreChange);
		Store.addChangeListener(this.onStoreChange);

		this.onMessage();
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {contentPackage} = this.props;

		if (data.type === SET_ERROR && data.NTIID === contentPackage.NTIID) {
			this.onMessage();
		}
	}


	onMessage = () => {
		const {contentPackage, fieldName} = this.props;
		const {NTIID} = contentPackage || {};
		const error = NTIID && Store.getErrorFor(NTIID, fieldName);

		this.setState({
			error
		});
	}


	onEditorFocus = (editor) => {
		this.setState({
			selectableValue: editor
		});
	}


	onEditorChange = () => {
		const {error} = this.state;

		if (error && error.clear) {
			error.clear();
		}
	}

	render () {
		const {className, fieldName, readOnly, ...otherProps} = this.props;
		const {selectableID, selectableValue, error} = this.state;
		const cls = cx('content-editor-meta-editor', className, fieldName, {error: !!error, 'read-only': readOnly});

		delete otherProps.onEditorFocus;

		return (
			<Selection.Component className={cls} id={selectableID} value={selectableValue}>
				<PlaintextEditor {...otherProps} onChange={this.onEditorChange} onEditorFocus={this.onEditorFocus} readOnly={readOnly} />
				{error && (<ErrorCmp className="content-editor-meta-error" error={error} />)}
			</Selection.Component>
		);
	}
}
