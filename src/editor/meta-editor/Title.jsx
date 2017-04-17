import React from 'react';
import {scoped} from 'nti-lib-locale';
import {HOC} from 'nti-web-commons';

import {Plugins} from '../../draft-core';
import {saveContentPackageTitle} from '../Actions';

import MetaEditor from './MetaEditor';

const {ItemChanges} = HOC;

const DEFAULT_TEXT = {
	placeholder: 'Title'
};
const t = scoped('CONTENT_TITLE_EDITOR', DEFAULT_TEXT);

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


	onItemChanged = () => {
		this.forceUpdate();
	}


	render () {
		const {contentPackage} = this.props;
		const {title} = contentPackage || {};

		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onItemChanged}>
				<MetaEditor
					className="content-title-editor"
					fieldName="title"
					contentPackage={contentPackage}
					value={title}
					onContentChange={this.onContentChange}
					plugins={plugins}
					placeholder={t('placeholder')}
				/>
			</ItemChanges>
		);
	}
}
