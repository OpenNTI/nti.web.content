import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';

const eventName = 'selectedEntityKey-changed';

export default class ExternalLink extends React.Component {
	static propTypes = {
		entityKey: React.PropTypes.string,
		children: React.PropTypes.any,
		store: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}

	state = {focused: false}


	get entityData () {
		const {entityKey} = this.props;

		return Entity.get(entityKey).getData();
	}

	componentDidMount () {
		const {store} = this.props;

		if (store) {
			store.removeListener(eventName, this.onSelectedEntityKeyChanged);
			store.addListener(eventName, this.onSelectedEntityKeyChanged);
		}
	}


	componentWillUnmount () {
		const {store} = this.props;

		if (store) {
			store.removeListener(eventName, this.onSelectedEntityKeyChanged);
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
		const {focused} = this.state;
		const {url} = this.entityData;
		const cls = cx('draft-core-external-link', {focused});

		return (
			<a href={url} className={cls}>
				{children}
			</a>
		);
	}
}
