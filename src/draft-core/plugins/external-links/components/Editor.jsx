import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';
import {focusElement} from 'nti-lib-dom';
import {scoped} from 'nti-lib-locale';
import {Button} from 'nti-web-commons';

import {EditingEntityKey} from '../Constants';
import {getEventFor} from '../../Store';
import {getFullHref} from '../utils';

const DEFAULT_TEXT = {
	urlLabel: 'Link',
	save: 'Save',
	edit: 'Change',
	invalid: 'Please enter a valid url.'
};

const t = scoped('EXTERNAL_LINK_EDITOR', DEFAULT_TEXT);

const stop = e => e.preventDefault();

const editingEntityKeyEvent = getEventFor(EditingEntityKey);

export default class ExternalLinkEditor extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		store: React.PropTypes.shape({
			setItem: React.PropTypes.func,
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}


	attachValidatorRef = x => this.validator = x

	constructor (props) {
		super(props);

		const {entityKey} = this.props;
		const entity = Entity.get(entityKey);
		const {data} = entity;

		this.state = {
			entity,
			editing: !data.href,
			href: data.href || '',
			fullHref: getFullHref(data.href || '')
		};
	}


	componentDidMount () {
		const {store} = this.props;

		if (store) {
			store.removeListener(editingEntityKeyEvent, this.onEditingEntityKeyChange);
			store.addListener(editingEntityKeyEvent, this.onEditingEntityKeyChange);
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

		this.setState({
			editing: entityKey === key
		});
	}


	setEditing () {
		const {store, entityKey} = this.props;

		store.setItem(EditingEntityKey, entityKey);
	}


	setNotEditing () {
		const {store} = this.props;

		store.setItem(EditingEntityKey, null);
	}


	onHrefFocus = () => {
		this.setEditing();
	}


	onHrefBlur = () => {
		this.setNotEditing();
	}


	onHrefChange = (e) => {
		this.setState({
			href: e.target.value,
			fullHref: getFullHref(e.target.value),
			error: null
		});
	}


	saveHref = () => {
		const {entityKey} = this.props;
		const {fullHref} = this.state;

		if (this.validator && this.validator.validity && !this.validator.validity.valid) {
			this.setState({
				error: t('invalid')
			});
		} else {
			Entity.mergeData(entityKey, {href: fullHref});
			this.setNotEditing();
		}
	}


	onEdit = () => {
		this.setEditing();
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
		const {href, fullHref, error} = this.state;
		const cls = cx('editor', {error});

		return (
			<div className={cls}>
				{error && (<div className="error">{error}</div>)}
				<label>
					<span>{t('urlLabel')}</span>
					<input type="url" value={fullHref} ref={this.attachValidatorRef} readOnly/>
					<input type="text" onFocus={this.onHrefFocus} onBlur={this.onHrefBlur} onChange={this.onHrefChange} value={href} ref={focusElement} />
				</label>
				<div className="buttons" onMouseDown={stop}>
					<Button onClick={this.saveHref}>{t('save')}</Button>
				</div>
			</div>
		);
	}


	renderInfo = () => {
		const {href} = this.state;

		return (
			<div onMouseDown={stop}>
				<span>{href}</span>
				<span onClick={this.onEdit}>{t('edit')}</span>
			</div>
		);
	}
}


//To delete get the block for the offset, find the range
//for the entity, if its at the start or end look at the next
//and previous blocks to see if they start or end with a entity
//range for the same entity, build a selection and use RichUtils.toggleLink
//to remove the ranges
