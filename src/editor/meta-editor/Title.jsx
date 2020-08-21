import './Title.scss';
import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Plugins} from '@nti/web-editor';

import {saveContentPackageTitle} from '../Actions';

import MetaEditor from './MetaEditor';


const DEFAULT_TEXT = {
	placeholder: 'Title'
};
const t = scoped('web-content.editor.meta-editor.Title', DEFAULT_TEXT);

const plugins = [
	Plugins.SingleLine.create(),
	Plugins.IgnoreDrop.create()
];

export default class ContentEditorTitle extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		readOnly: PropTypes.bool
	}


	onContentChange = (title) => {
		const {contentPackage} = this.props;

		saveContentPackageTitle(contentPackage, title);
	}


	render () {
		const {contentPackage, readOnly} = this.props;
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
				readOnly={readOnly}
			/>
		);
	}
}
