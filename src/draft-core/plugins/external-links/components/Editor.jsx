import React from 'react';
import {Entity} from 'draft-js';
import {focusElement} from 'nti-lib-dom';

import {EditingEntityKey} from '../Constants';

export default class ExternalLinkEditor extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		store: React.PropTypes.shape({
			setItem: React.PropTypes.func,
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}

	constructor (props) {
		super(props);

		const {entityKey} = this.props;
		const entity = Entity.get(entityKey);
		const {data} = entity;

		this.state = {
			entity,
			editing: !data.href,
			href: data.href || ''
		};
	}


	onHrefFocus = () => {
		const {store, entityKey} = this.props;

		store.setItem(EditingEntityKey, entityKey);
	}


	onHrefBlur = () => {
		const {store} = this.props;

		store.setItem(EditingEntityKey, null);
	}


	onHrefChange = () => {
		debugger;
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
		const {href} = this.state;

		return (
			<div className="editor">
				<input type="text" onFocus={this.onHrefFocus} onBlur={this.onHrefBlur} onChange={this.onHrefChange} value={href} ref={focusElement} />
			</div>
		);
	}


	renderDisplay = () => {
		return (
			<div>
				<span>Display</span>
			</div>
		);
	}
}


//To delete get the block for the offset, find the range
//for the entity, if its at the start or end look at the next
//and previous blocks to see if they start or end with a entity
//range for the same entity, build a selection and use RichUtils.toggleLink
//to remove the ranges
