import React from 'react';

export default class EditorPanel extends React.Component {
	static propTypes = {
		content: React.PropTypes.object,
		course: React.PropTypes.object
	}


	render () {
		return (
			<div>
				<span>Editor Panel</span>
			</div>
		);
	}
}
