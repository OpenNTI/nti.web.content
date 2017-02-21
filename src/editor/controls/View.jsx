import React from 'react';
import {ContextProvider} from '../../draft-core';

import TypeFormat from './TypeFormat';
import StyleFormat from './StyleFormat';
import Status from './Status';

function getEditorForSelection (selection) {
	const first = selection && selection[0];
	let value = first && first.value;
	let editor;

	//If there is more than one don't return any editor for now
	if (value && selection.length === 1) {
		editor = value;
	}

	return editor;
}

export default class ContentEditorControls extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object,
		selectionManager: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	componentDidMount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.addListener('selection-changed', this.onSelectionChanged);
		}
	}


	componentWillUnmount () {
		const {selectionManager} = this.props;

		if (selectionManager) {
			selectionManager.removeListener('selection-changed', this.onSelectionChange);
		}
	}


	onSelectionChanged = (selection) => {
		this.setState({selection});
	}


	render () {
		const {selection} = this.state;
		const editor = getEditorForSelection(selection);

		return (
			<ContextProvider editor={getEditorForSelection(selection)}>
				<div className="content-editor-controls">
					<TypeFormat  editor={editor} />
					<StyleFormat editor={editor} />
					<div className="spacer" />
					<Status />
				</div>
			</ContextProvider>
		);
	}
}