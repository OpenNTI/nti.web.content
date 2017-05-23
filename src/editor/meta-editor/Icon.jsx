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

	constructor (props) {
		super(props);
		this.state = {fileOver: false, counter: 0};
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
		this.setState({ fileOver: true, counter: this.state.counter + 1 });
	}


	dragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.setState({ counter: this.state.counter - 1 });
		if(this.state.counter - 1 === 0) {
			this.setState({ fileOver: false });
		}
	}


	drop = (e) => {
		const {contentPackage} = this.props;
		e.preventDefault();
		e.stopPropagation();
		this.setState({ fileOver: false });

		let file = e.dataTransfer.items[0].getAsFile();
		let url = this.createObjectURL(file);
		saveContentPackageIcon(contentPackage, url);
	}


	getURLObject = () => {
		let url;

		if (window.URL && window.URL.createObjectURL) {
			url = window.URL;
		} else if (window.webkitURL && window.webkitURL.createObjectURL) {
			url = window.webkitURL;
		}

		return url;
	}


	createObjectURL = (file) => {
		let url = this.getURLObject();

		if (!url) { return null; }

		this.objectURL = url.createObjectURL(file);

		return this.objectURL;
	}


	render () {
		const {contentPackage} = this.props;
		const {icon} = contentPackage || {};
		let {fileOver} = this.state;
		const cls = cx('content-icon-editor', {placeholder: !icon}, {'file-over': fileOver});


		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChanged}>
				<div className={cls} onClick={this.onClick} onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDragLeave={this.dragLeave} onDrop={this.drop}>
					{!icon && this.renderPlaceholder()}
					{icon && this.renderIcon(icon)}
					<input type="file" data-qtip="Cover Image" accept="image/*" />
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
