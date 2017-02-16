import React from 'react';
import {Selection} from 'nti-web-commons';

import {Editor} from '../../draft-core';

export default class ContentEditor extends React.Component {
	static propTypes = {
		content: React.PropTypes.object,
		course: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		this.state = {
			selectableID: 'content-editor',
			selectableValue: null
		};
	}


	onEditorFocus = (editor) => {
		const {selectableValue} = this.state;

		if (selectableValue !== editor) {
			this.setState({
				selectableValue: editor
			});
		}
	}


	render () {
		const {selectableID, selectableValue} = this.state;

		return (
			<Selection.Component className="content-editing-editor-container" id={selectableID} value={selectableValue}>
				<Editor className="content-editing-editor" onFocus={this.onEditorFocus} />
			</Selection.Component>
		);
	}
}
