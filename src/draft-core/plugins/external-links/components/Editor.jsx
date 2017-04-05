import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';
import {scoped} from 'nti-lib-locale';
import {Button} from 'nti-web-commons';

import {EditingEntityKey, SelectedEntityKey} from '../Constants';
import {getEventFor} from '../../Store';
import {
	getFullHref,
	removeEntityKeyAtOffset,
	replaceEntityTextAtOffset,
	createNewLinkAtOffset
} from '../utils';


const DEFAULT_TEXT = {
	urlLabel: 'URL',
	displayLabel: 'Display Text',
	save: 'Save',
	cancel: 'Cancel',
	edit: 'Change',
	remove: 'Remove',
	invalid: 'Please enter a valid url.'
};

const t = scoped('EXTERNAL_LINK_EDITOR', DEFAULT_TEXT);

const stop = e => e.preventDefault();

const editingEntityKeyEvent = getEventFor(EditingEntityKey);

export default class ExternalLinkEditor extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		offsetKey: React.PropTypes.string,
		decoratedText: React.PropTypes.string,
		store: React.PropTypes.shape({
			setItem: React.PropTypes.func,
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		}),
		getEditorState: React.PropTypes.func,
		setEditorState: React.PropTypes.func
	}


	attachURLInputRef = x => this.urlInput = x
	attachValidatorRef = x => this.validator = x

	constructor (props) {
		super(props);

		const {entityKey, decoratedText} = this.props;
		const entity = Entity.get(entityKey);
		const {data} = entity;

		this.state = {
			entity,
			decoratedText,
			newLink: !data.href,
			editing: !data.href,
			href: data.href || '',
			fullHref: getFullHref(data.href || ''),
		};
	}


	componentDidMount () {
		const {store} = this.props;
		const {editing} = this.state;

		if (store) {
			store.removeListener(editingEntityKeyEvent, this.onEditingEntityKeyChange);
			store.addListener(editingEntityKeyEvent, this.onEditingEntityKeyChange);
		}

		if (editing) {
			this.setEditing();
		}
	}


	componentWillUnmount () {
		const {store} = this.props;

		if (store) {
			store.removeListener(editingEntityKeyEvent, this.onEditingEntityKeyChange);
		}
	}


	onEditingEntityKeyChange = (key) => {
		const {entityKey} = this.props;
		const editing = entityKey === key;

		this.setState({
			editing
		}, () => {
			if (this.urlInput) {
				this.urlInput.focus();
			}
		});
	}


	setEditing () {
		const {store, entityKey} = this.props;

		store.setItem(EditingEntityKey, entityKey);
	}


	setNotEditing () {
		const {store} = this.props;
		const {fullHref, newLink} = this.state;

		store.setItem(EditingEntityKey, null);
		store.setItem(SelectedEntityKey, null);

		if (newLink && !fullHref) {
			this.doRemove();
		}
	}


	onInputFocus = () => {
		this.setEditing();

		this.isFocused = true;
	}


	onInputBlur = () => {
		this.isFocused = false;

		//Wait to see if we can focus
		setTimeout(() => {
			if (!this.isFocused) {
				this.setNotEditing();
			}
		});
	}


	onURLChange = (e) => {
		this.setState({
			href: e.target.value,
			fullHref: getFullHref(e.target.value),
			error: null
		});
	}


	onDecoratedTextChange = (e) => {
		this.setState({
			decoratedText: e.target.value
		});
	}


	doRemove () {
		const {getEditorState, setEditorState, entityKey, offsetKey} = this.props;
		const newState = removeEntityKeyAtOffset(entityKey, offsetKey, getEditorState());

		setEditorState(newState);
	}


	doSave () {
		const {entityKey, decoratedText:oldText} = this.props;
		const {fullHref, decoratedText:newText, newLink} = this.state;

		if (newLink) {
			this.createNewLink(fullHref);

			this.setNotEditing();
		} else {
			Entity.mergeData(entityKey, {href: fullHref});

			if (newText !== oldText) {
				this.replaceText(newText || fullHref);
			}
		}
	}

	createNewLink (link) {
		const {getEditorState, setEditorState, entityKey, offsetKey} = this.props;
		const newState = createNewLinkAtOffset(link, entityKey, offsetKey, getEditorState());

		setEditorState(newState);
	}


	replaceText (text) {
		const {getEditorState, setEditorState, entityKey, offsetKey} = this.props;
		const newState = replaceEntityTextAtOffset(text, entityKey, offsetKey, getEditorState());

		setEditorState(newState);
	}


	onSave = () => {
		//Set this to true so we keep focus until we are done saving
		this.isFocused = true;

		if (this.validator && this.validator.validity && !this.validator.validity.valid) {
			this.setState({
				error: t('invalid')
			});
		} else {
			this.doSave();

			this.setNotEditing();
		}
	}


	onCancel = () => {
		this.setNotEditing();
	}


	onEdit = () => {
		this.setEditing();
	}


	onRemove = () => {
		//Set this to true so we can keep focus until we are done saving
		this.isFocused = true;

		this.doRemove();

		this.setNotEditing();
	}


	render () {
		const {editing} = this.state;

		return (
			<div className="external-link-editor">
				{
					editing ?
						this.renderEditor() :
						this.renderInfo()
				}
			</div>
		);
	}


	renderEditor = () => {
		const {href, fullHref, decoratedText, error, newLink} = this.state;
		const cls = cx('editor', {error});

		return (
			<div className={cls}>
				{error && (<div className="error">{error}</div>)}
				<label>
					<span>{t('urlLabel')}</span>
					<input type="url" value={fullHref} ref={this.attachValidatorRef} readOnly/>
					<input type="text" onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onURLChange} value={href} ref={this.attachURLInputRef} />
				</label>
				{newLink ?
					null :
					(
						<label>
							<span>{t('displayLabel')}</span>
							<input type="text" value={decoratedText} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onDecoratedTextChange} />
						</label>
					)
				}
				<div className="buttons" onMouseDown={stop}>
					<Button onClick={this.onCancel}>{t('cancel')}</Button>
					<Button onClick={this.onSave} disabled={!href}>{t('save')}</Button>
				</div>
			</div>
		);
	}


	renderInfo = () => {
		const {href} = this.state;

		return (
			<div className="info" onMouseDown={stop}>
				<span className="link">{href}</span>
				<span className="edit" onClick={this.onEdit}>{t('edit')}</span>
				<span className="remove" onClick={this.onRemove}>{t('remove')}</span>
			</div>
		);
	}
}
