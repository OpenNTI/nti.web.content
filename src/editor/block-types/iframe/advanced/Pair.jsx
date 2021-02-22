import './Pair.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const t = scoped('content.editor.block-types.iframe.Advanced.pair', {
	keyName: 'Key Name',
	value: 'Value',
});

export default class IframeAdvancedKeyPair extends React.Component {
	static propTypes = {
		index: PropTypes.number,
		pair: PropTypes.shape({
			key: PropTypes.string,
			value: PropTypes.string,
		}),

		onChange: PropTypes.func,
		onRemove: PropTypes.func,
	};

	onKeyNameChange = newName => {
		const { onChange, pair, index } = this.props;

		if (onChange) {
			onChange(index, { key: newName, value: pair.value });
		}
	};

	onValueChange = newValue => {
		const { onChange, pair, index } = this.props;

		if (onChange) {
			onChange(index, { key: pair.key, value: newValue });
		}
	};

	onRemove = () => {
		const { onRemove, index } = this.props;

		if (onRemove) {
			onRemove(index);
		}
	};

	render() {
		const { pair } = this.props;
		const { key, value } = pair || {};

		return (
			<div className="content-editor-iframe-advanced-pair">
				<div className="nti-name">
					<Input.Text
						placeholder={t('keyName')}
						value={key || ''}
						onChange={this.onKeyNameChange}
					/>
				</div>
				<div className="value">
					<Input.Text
						placeholder={t('value')}
						value={value || ''}
						onChange={this.onValueChange}
					/>
				</div>
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-remove" />
				</div>
			</div>
		);
	}
}
