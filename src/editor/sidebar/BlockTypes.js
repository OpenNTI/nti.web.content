import React from 'react';
import PropTypes from 'prop-types';

import {ContextProvider} from '../../draft-core';
import {Buttons} from '../block-types';

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

export default class BlockTypes extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		selectionManager: PropTypes.shape({
			addListener: PropTypes.func,
			removeListener: PropTypes.func
		})
	}

	state = {}

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
		const {contentPackage, course} = this.props;
		const {selection} = this.state;

		return (
			<ContextProvider editor={getEditorForSelection(selection)}>
				<div className="block-types">
					{Buttons.map((button, key) => {
						return React.createElement(button, {key, contentPackage, course});
					})}
				</div>
			</ContextProvider>
		);
	}
}
