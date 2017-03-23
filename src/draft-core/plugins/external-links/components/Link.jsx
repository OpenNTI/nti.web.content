import React from 'react';
import cx from 'classnames';
import {Entity} from 'draft-js';

import Editor from './Editor';

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

	state = {focused: false, editing: false}


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


	setPendingData = (data) => {
		this.pendingData = data;
	}


	onChange = () => {

	}


	onRemove = () => {

	}


	render () {
		const {children} = this.props;
		const {focused, editing} = this.state;
		const {url} = this.entityData;
		const cls = cx('draft-core-external-link', {focused: true});

		return (
			<a href={url} className={cls}>
				{children}
				{(focused || editing || !url) && this.renderTooltip()}
			</a>
		);
	}


	renderTooltip = () => {
		const {editing} = this.state;
		const {url} = this.entityData;
		const shouldEdit = editing || !url;

		return (
			<div className="tooltip-container">
				<div className="arrow" />
				{shouldEdit && this.renderEditor()}
				{!shouldEdit && this.renderDisplay()}
			</div>
		);
	}


	renderDisplay = () => {
		return (
			<div className="display" />
		);
	}


	renderEditor = () => {
		return (
			<Editor data={this.endityData} onChange={this.setPendingChange} onSave={this.onChange} onRemove={this.onRemove} />
		);
	}
}
