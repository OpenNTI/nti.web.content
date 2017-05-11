import React from 'react';
import {scoped} from 'nti-lib-locale';

import {Plugins} from '../../draft-core';
import {saveContentPackageTitle} from '../Actions';

import MetaEditor from './MetaEditor';


const DEFAULT_TEXT = {
	placeholder: 'Title'
};
const t = scoped('CONTENT_TITLE_EDITOR', DEFAULT_TEXT);

const plugins = [
	Plugins.SingleLine.create(),
	Plugins.IgnoreDrop.create()
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
				placeholder={t('placeholder')}
			/>
		);
	}
}
