import React from 'react';

import {saveContentPackageDescription} from '../Actions';

import MetaEditor from './MetaEditor';

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onContentChange = (description) => {
		const {contentPackage} = this.props;

		saveContentPackageDescription(contentPackage, description);
	}


	render () {
		const {contentPackage} = this.props;
		const {description} = contentPackage || {};

		return (
			<MetaEditor
				className="content-description-editor"
				fieldName="description"
				contentPackage={contentPackage}
				value={description}
				onContentChange={this.onContentChange}
			/>
		);
	}
}
