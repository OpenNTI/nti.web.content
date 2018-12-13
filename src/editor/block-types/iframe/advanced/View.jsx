import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Pair from './Pair';

const t = scoped('content.editor.block-types.iframe.Advanced', {
	heading: 'Advanced',
	name: 'Name',
	value: 'Value',
	missingKey: 'Cannot have an empty key.',
	duplicateKeys: 'Cannot have duplicate keys.'
});

export default class ContentEditorBlockTypeIframeAdvanced extends React.Component {
	static propTypes = {
		properties: PropTypes.object,
		onChange: PropTypes.func,
		onValidityChange: PropTypes.func
	}

	state = { showing: false, new: []}

	toggle = () => {
		this.setState({
			showing: !this.state.showing
		});
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {properties} = this.props;
		const {properties: prev} = prevProps;

		if (properties !== prev) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {properties} = props;

		const pairs = Object.keys(properties || {})
			.map(key => ({key, value: properties[key]}));

		this.setState({
			pairs
		});
	}


	setInvalid = () => {
		const {onValidityChange} = this.props;

		if (onValidityChange) {
			onValidityChange(false);
		}
	}


	setValid = () => {
		const {onValidityChange} = this.props;

		if (onValidityChange) {
			onValidityChange(true);
		}
	}


	setError = (error) => {
		this.setState({error});
	}


	onDuplicateKey = () => {
		this.setInvalid();
		this.setError(t('duplicateKeys'));
	}


	onMissingKey = () => {
		this.setInvalid();
		this.setError(t('missingKey'));
	}


	onChange = () => {
		const {onChange} = this.props;
		const {pairs} = this.state;
		const properties = {};

		for (let pair of pairs) {
			const {key, value} = pair;

			if (!key) { return this.setInvalid(); }
			if (properties.hasOwnProperty(key)) { return this.onDuplicateKey(); }

			properties[key] = value;
		}

		this.setValid();

		if (onChange) {
			onChange(properties);
		}
	}


	onPairChange = (index, pair) => {
		const pairs = [...this.state.pairs];
		const oldPair = pairs[index];

		pairs[index] = pair;

		this.setError(null);

		this.setState({
			pairs
		}, () => {
			if (oldPair.key && !pair.key) {
				this.onMissingKey();
			} else {
				this.onChange();
			}
		});
	}


	onRemovePair = (index) => {
		const pairs = [...this.state.pairs];

		pairs.splice(index, 1);

		this.setError(null);

		this.setState({
			pairs
		}, () => this.onChange());
	}


	addNewPair = () => {
		const {pairs} = this.state;

		this.setState({
			pairs: [...pairs, {key: '', value: ''}]
		}, () => {
			this.setInvalid();
		});
	}


	render () {
		const {showing, pairs, error} = this.state;

		return (
			<div className={cx('content-editor-blocktypes-iframe-advanced', {showing})}>
				<div className="heading" onClick={this.toggle}>
					<span>{t('heading')}</span>
					<i className="icon-chevron-down" />
				</div>
				{error && (<span className="error">{error}</span>)}
				{showing && (
					<div className="content">
						{this.renderProperties(pairs)}
						{this.renderAddNew()}
					</div>
				)}
			</div>
		);
	}


	renderProperties (pairs) {
		return (
			<ul>
				<li className="labels">
					<span className="name">{t('name')}</span>
					<span className="value">{t('value')}</span>
				</li>
				{pairs.map((pair, index) => {
					return (
						<li key={index}>
							<Pair index={index} pair={pair} onChange={this.onPairChange} onRemove={this.onRemovePair} />
						</li>
					);
				})}
			</ul>
		);
	}


	renderAddNew () {
		return (
			<div className="add-new-pair" onClick={this.addNewPair}>
				<i className="icon-add" />
				<span>Add New</span>
			</div>
		);
	}
}
