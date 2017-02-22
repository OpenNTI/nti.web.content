import React from 'react';

export default class ContentEditorIcon extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onClick = () => {

	}


	render () {
		return (
			<div className="content-editor-icon">
				<span>Icon</span>
			</div>
		);
	}
}
