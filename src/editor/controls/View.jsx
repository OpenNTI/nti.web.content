import React from 'react';

import Formatting from './Formatting';

export default class ContentEditorControls extends React.Component {
	static propTypes = {
		content: React.PropTypes.object,
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

		return (
			<div className="content-editor-controls">
				<Formatting selection={selection} />
			</div>
		);
	}
}
