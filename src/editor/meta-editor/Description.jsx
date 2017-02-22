import React from 'react';

export default class ContentEditorDescription extends React.Component {
	static propTypes = {
		contentPackages: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onClick = () => {

	}


	render () {
		return (
			<div className="content-editor-content">
				<span>Description</span>
			</div>
		);
	}
}
