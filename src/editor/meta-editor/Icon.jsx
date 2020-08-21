import './Icon.scss';
//TODO: make a generic image input component, most of these things should generalize styles, dropping files etc.

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {ContentResources, HOC} from '@nti/web-commons';
import {URL} from '@nti/lib-dom';

import {saveContentPackageIcon} from '../Actions';

const {ItemChanges} = HOC;

const DEFAULT_TEXT = {
	placeholder: 'Add an Image',
	clear: 'Clear Image'
};

const t = scoped('web-content.editor.meta-editor.Icon', DEFAULT_TEXT);

function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}

export default class ContentEditorIcon extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		readOnly: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {fileOver: false};
	}

	onClick = (e) => {
		e.preventDefault();

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


	dragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	}


	dragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ fileOver: true });
	}


	dragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ fileOver: false });
	}


	drop = (e) => {
		const {contentPackage} = this.props;
		const {items} = e.dataTransfer || {};
		const [item] = items || [];
		e.preventDefault();
		e.stopPropagation();
		this.setState({ fileOver: false });

		if(item) {
			let file = item.getAsFile();
			let url = this.createObjectURL(file);
			saveContentPackageIcon(contentPackage, url);
		}
	}


	createObjectURL = (file) => {
		if (!URL) { return null; }

		const objectURL = URL.createObjectURL(file);

		return objectURL;
	}


	render () {
		const {contentPackage, readOnly} = this.props;
		const {icon} = contentPackage || {};
		let {fileOver} = this.state;
		const cls = cx('content-icon-editor', {placeholder: !icon}, {'file-over': fileOver, 'read-only': readOnly});


		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChanged}>
				<div className={cls} onClick={this.onClick}>
					{!icon && this.renderPlaceholder()}
					{icon && this.renderIcon(icon)}
					<input type="file" data-qtip="Cover Image" accept="image/*" onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.drop}/>
					{icon && this.renderClear()}
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
			</div>
		);
	}


	renderClear = () => {
		return (
			<span className="clear" onClick={this.onClear}>{t('clear')}</span>
		);
	}
}
