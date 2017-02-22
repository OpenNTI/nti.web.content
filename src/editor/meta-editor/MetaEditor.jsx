import React from 'react';
import cx from 'classnames';
import {Selection} from 'nti-web-commons';

import {PlaintextEditor} from '../../draft-core';

export default class ContentMetaEditor extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		fieldName: React.PropTypes.string,
		onChange: React.PropTypes.func
	}

	constructor (props) {
		super(props);

		const {fieldName} = props;

		this.state = {
			selectableID: fieldName,
			selectableValue: null
		};
	}


	onEditorFocus = (editor) => {
		this.setState({
			selectableValue: editor
		});
	}


	onEditorChange = (editorState) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(editorState);
		}
	}

	render () {
		const {className, fieldName, ...otherProps} = this.props;
		const {selectableID, selectableValue} = this.state;
		const cls = cx('content-meta-editor', className, fieldName);

		return (
			<Selection.Component className={cls} id={selectableID} value={selectableValue}>
				<PlaintextEditor {...otherProps} onChange={this.onEditorChange} onEditorFocus={this.onEditorFocus} />
			</Selection.Component>
		);
	}
}
