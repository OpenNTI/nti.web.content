//TODO: make a generic image input component, most of these things should generalize styles, dropping files etc.

import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {ContentResources, HOC} from 'nti-web-commons';

import {saveContentPackageIcon} from '../Actions';

const {ItemChanges} = HOC;

const DEFAULT_TEXT = {
	placeholder: 'Add an Image',
	clear: 'Clear Image'
};

const t = scoped('CONTENT_EDITOR_ICON', DEFAULT_TEXT);

function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}

export default class ContentEditorIcon extends React.Component {
	static propTypes = {
		contentPackage: React.PropTypes.object,
		course: React.PropTypes.object
	}


	onClick = () => {
		const {course, contentPackage} = this.props;

		const accept = x => !x.isFolder && fileIsImage(x);

		ContentResources.selectFrom(course.getID(), accept)
			.then((file) => {
				saveContentPackageIcon(contentPackage, file.url);
			});
	}


	onClear = (e) => {
		const {contentPackage} = this.props;

		if (e) {
			e.stopPropagation();
		}

		saveContentPackageIcon(contentPackage, '');
	}


	onContentPackageChanged = () => {
		this.forceUpdate();
	}


	render () {
		const {contentPackage} = this.props;
		const {icon} = contentPackage || {};
		const cls = cx('content-icon-editor', {placeholder: !icon});


		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChanged}>
				<div className={cls} onClick={this.onClick}>
					{!icon && this.renderPlaceholder()}
					{icon && this.renderIcon(icon)}
				</div>
			</ItemChanges>
		);
	}


	renderPlaceholder = () => {
		return (
			<div className="placeholder">
				<i className="icon-add-image" />
				<span>{t('placeholder')}</span>
			</div>
		);
	}


	renderIcon = (icon) => {
		const styles = icon ? {backgroundImage: `url('${icon}')`} : {};

		return (
			<div className="icon" style={styles}>
				<i className="icon-add-image" />
				<span onClick={this.onClear}>{t('clear')}</span>
			</div>
		);
	}
}
