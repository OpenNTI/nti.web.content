import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from 'nti-lib-locale';
import {Plugins} from 'nti-web-editor';

import {saveContentPackageDescription} from '../Actions';

import MetaEditor from './MetaEditor';

const DEFAULT_TEXT = {
	placeholder: 'Write a description...'
};

const t = scoped('nti-content.editor.meta-editor.Description', DEFAULT_TEXT);

const plugins = [
	Plugins.IgnoreDrop.create()
];

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		readOnly: PropTypes.bool
	}


	onContentChange = (description) => {
		const {contentPackage} = this.props;

		saveContentPackageDescription(contentPackage, description);
	}


	render () {
		const {contentPackage, readOnly} = this.props;
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
				readOnly={readOnly}
			/>
		);
	}
}
