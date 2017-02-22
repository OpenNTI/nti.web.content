import React from 'react';

import {Plugins} from '../../draft-core';
import {saveContentPackageTitle} from '../Actions';

import MetaEditor from './MetaEditor';

const plugins = [
	Plugins.createSingleLine()
];

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onContentChange = (title) => {
		const {contentPackage} = this.props;

		saveContentPackageTitle(contentPackage, title);
	}


	render () {
		const {contentPackage} = this.props;
		const {title} = contentPackage || {};

		return (
			<MetaEditor
				className="content-title-editor"
				fieldName="title"
				contentPackage={contentPackage}
				value={title}
				onContentChange={this.onContentChange}
				plugins={plugins}
			/>
		);
	}
}
