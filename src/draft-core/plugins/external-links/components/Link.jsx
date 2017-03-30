import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';

import {SelectedEntityKey} from '../Constants';
import {getEventFor} from '../../Store';

const eventName = getEventFor(SelectedEntityKey);

export default class ExternalLink extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		children: React.PropTypes.any,
		offsetKey: React.PropTypes.string,
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


	getBoundingClientRect () {
		return this.anchorRef && this.anchorRef.getBoundingClientRect ?
				this.anchorRef.getBoundingClientRect() :
				{top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0};
	}


	componentDidMount () {
		const {store, entityKey} = this.props;

		if (store) {
			store.removeListener(eventName, this.onSelectedEntityKeyChanged);
			store.addListener(eventName, this.onSelectedEntityKeyChanged);

			const cmps = store.getItem(entityKey) || [];

			store.setItem(entityKey, [...cmps, this]);
		}
	}


	componentWillUnmount () {
		const {store, entityKey} = this.props;

		if (store) {
			store.removeListener(eventName, this.onSelectedEntityKeyChanged);

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


	render () {
		const {children} = this.props;
		const {url} = this.entityData;
		const cls = cx('draft-core-external-link', {focused: true});

		return (
			<a href={url} className={cls} ref={this.setAnchorRef}>
				{children}
			</a>
		);
	}
}
