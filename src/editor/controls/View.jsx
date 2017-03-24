import React from 'react';

import {ContextProvider} from '../../draft-core';

import TypeFormat from './TypeFormat';
import StyleInsertFormat from './StyleInsertFormat';
import Status from './Status';
import Publish from './Publish';

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
			selectionManager.removeListener('selection-changed', this.onSelectionChanged);
		}
	}


	onSelectionChanged = (selection) => {
		this.setState({selection});
	}


	render () {
		const {contentPackage} = this.props;
		const {selection} = this.state;
		const editor = getEditorForSelection(selection);

		return (
			<ContextProvider editor={getEditorForSelection(selection)}>
				<div className="content-editor-controls">
					<TypeFormat  editor={editor} />
					<StyleInsertFormat editor={editor} />
					<div className="spacer" />
					<Status />
					<Publish contentPackage={contentPackage} />
				</div>
			</ContextProvider>
		);
	}
}
