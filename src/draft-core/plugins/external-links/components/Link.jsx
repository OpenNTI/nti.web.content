import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';

import {SelectedEntityKey, EditingEntityKey} from '../Constants';
import {getEventFor} from '../../Store';

const selectedEntityKeyEvent = getEventFor(SelectedEntityKey);
const editingEntityKeyEvent = getEventFor(EditingEntityKey);

export default class ExternalLink extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		children: React.PropTypes.any,
		offsetKey: React.PropTypes.string,
		decoratedText: React.PropTypes.string,
		store: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}

	state = {focused: false, editing: false}

	setAnchorRef = (x) => { this.anchorRef = x; }

	get entityData () {
		const {entityKey} = this.props;

		return Entity.get(entityKey).getData();
	}


	get offsetKey () {
		return this.props.offsetKey;
	}


	get decoratedText () {
		return this.props.decoratedText;
	}


	getBoundingClientRect () {
		return this.anchorRef && this.anchorRef.getBoundingClientRect ?
				this.anchorRef.getBoundingClientRect() :
				{top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0};
	}


	events = {
		[selectedEntityKeyEvent]: x => this.onSelectedEntityKeyChanged(x),
		[editingEntityKeyEvent]: x => this.onEditingEntityKeyChanged(x)
	}


	componentDidMount () {
		const {store, entityKey} = this.props;

		if (store) {
			store.addListeners(this.events);

			const cmps = store.getItem(entityKey) || [];

			store.setItem(entityKey, [...cmps, this]);
		}
	}


	componentWillUnmount () {
		const {store, entityKey} = this.props;

		if (store) {
			store.removeListeners(this.events);

			const cmps = store.getItem(entityKey) || [];

			store.clearItem(entityKey, cmps.filter(x => x !== this));
		}
	}


	onSelectedEntityKeyChanged = (selectedKey) => {
		const {entityKey} = this.props;
		const {focused} = this.state;
		const shouldFocus = entityKey === selectedKey;

		if (focused !== shouldFocus) {
			this.setState({
				focused: shouldFocus
			});
		}
	}


	onEditingEntityKeyChanged = (editingKey) => {
		const {entityKey} = this.props;

		this.setState({
			editing: entityKey === editingKey
		});
	}


	render () {
		const {children} = this.props;
		const {focused, editing} = this.state;
		const {url} = this.entityData;
		const cls = cx('draft-core-external-link', {focused, editing});

		return (
			<a href={url} className={cls} ref={this.setAnchorRef}>
				{children}
			</a>
		);
	}
}
