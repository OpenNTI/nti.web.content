import React from 'react';

export default class ExternalLinkEditor extends React.Component {
	static propTypes = {
		entity: React.PropTypes.object,
		store: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}

	state = {editing: false}


	render () {
		const {entity} = this.props;

		debugger;

		return (
			<div>
				<span>External Link Editor</span>
			</div>
		);
	}
}
