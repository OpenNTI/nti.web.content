import React from 'react';

import MetaEditor from './MetaEditor';

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onContentChange = (title) => {
		debugger;
	}


	render () {
		const {contentPackage} = this.props;
		const {title} = contentPackage || {};

		return (
			<MetaEditor className="content-title-editor" fieldName="title" value={title} onContentChange={this.onContentChange} />
		);
	}
}
