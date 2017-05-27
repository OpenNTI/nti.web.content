import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from 'nti-lib-locale';

import {Plugins} from '../../draft-core';
import {saveContentPackageDescription} from '../Actions';

import MetaEditor from './MetaEditor';

const DEFAULT_TEXT = {
	placeholder: 'Write a description here'
};

const t = scoped('CONTENT_EDITOR_TITLE', DEFAULT_TEXT);

const plugins = [
	Plugins.IgnoreDrop.create()
];

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object
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
				placeholder={t('placeholder')}
				plugins={plugins}
			/>
		);
	}
}
