import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Prompt, DialogButtons, Loading} from '@nti/web-commons';

const DEFAULT_TEXT = {
	header: 'Enter a link to an Iframe.',
	cancel: 'Cancel',
	done: 'Done',
	placeholder: 'Enter a link or embed code',
	invalid: 'Invalid Link. Please check your input and make sure your link is secure (https).',
	title: 'Iframe Title',
	height: 'Height',
	width: 'Width',
	key: 'Key',
	value: 'Value'
};

const t = scoped('web-content.editor.block-types.iframe.Picker', DEFAULT_TEXT);

export default class IframePicker extends React.Component {
	static show (value) {
		return new Promise((fulfill, reject) => {
			Prompt.modal(
				<IframePicker
					value={value}
					onSelect={fulfill}
					onCancel={reject}
				/>,
				'content-picker-iframe-picker-container'
			);
		});
	}

	static propTypes = {
		value: PropTypes.object,
		onSelect: PropTypes.func,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func
	}

	constructor (props) {
		super(props);

		const {value} = props;

		const keyValuePairs = [];

		const nonAdvanced = ['title', 'height', 'width', 'no-sandboxing', 'allowfullscreen'];

		if(value && value.attributes) {
			for(let key in value.attributes) {
				if(!nonAdvanced.includes(key)) {
					keyValuePairs.push({key, valueString: value.attributes[key]});
				}
			}
		}

		this.state = {
			value: value && value.src || '',
			title: value && value.attributes.title || '',
			height: value && value.attributes.height || '',
			width: value && value.attributes.width || '',
			sandbox: value && value.attributes['no-sandboxing'] === 'false' || false,
			allowFullScreen: value && value.attributes.allowfullscreen === 'true' || false,
			showAccordion: false,
			keyValuePairs: keyValuePairs
		};
	}

	componentDidUpdate (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:prevValue} = this.props;

		if (nextValue !== prevValue) {
			this.setState({
				value: nextValue
			});
		}
	}


	onCancel = () => {
		const {onCancel, onDismiss} = this.props;

		onDismiss();

		if (onCancel) {
			onCancel();
		}
	}


	onSave = () => {
		const {value, width, height, title, invalid, allowFullScreen, sandbox, keyValuePairs} = this.state;
		const {onSelect, onDismiss} = this.props;
		const noSandbox = !sandbox;

		let attributes = {title, width: width || '100%', height: height || '100%', allowfullscreen: allowFullScreen.toString(), 'no-sandboxing': noSandbox.toString()};

		keyValuePairs.forEach((keyValuePair) => {
			const key = keyValuePair.key;
			const valueString = keyValuePair.valueString;
			attributes[key] = valueString;
		});

		if(invalid) {
			this.setState({
				failedSave: true
			});
		} else {
			this.setState({
				failedSave: false,
				saving: true
			}, () => {
				onSelect({src: value, attributes});
				onDismiss();
			});
		}
	}


	onInputChange = (e) => {
		const secureUrl = /^(https:\/\/www\.|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
		const isUrl = secureUrl.test(e.target.value);

		if(isUrl) {
			this.setState({
				value: e.target.value,
				invalid: false
			});
		} else {
			const div = document.createElement('div');
			div.innerHTML = e.target.value;
			const iframe = div.querySelector('iframe');

			const width = iframe ? iframe.getAttribute('width') : '';
			const height = iframe ? iframe.getAttribute('height') : '';
			const title = iframe ? iframe.getAttribute('title') : '';
			const allowFullScreen = iframe && iframe.hasAttribute('allowfullscreen');
			const sandbox = iframe && iframe.hasAttribute('sandbox');
			const src = iframe && iframe.src;

			if(src && secureUrl.test(src)) {
				this.setState({
					value: src,
					width,
					height,
					title,
					allowFullScreen,
					sandbox,
					invalid: false
				});
			} else {
				this.setState({
					value: e.target.value,
					invalid: true
				});
			}
		}
	}

	onWidthChange = (e) => {
		this.setState({width: e.target.value});
	}

	onHeightChange = (e) => {
		this.setState({height: e.target.value});
	}

	onTitleChange = (e) => {
		this.setState({title: e.target.value});
	}

	onFullScreenChange = (e) => {
		this.setState({allowFullScreen: e.target.checked});
	}

	onSandboxChange = (e) => {
		this.setState({sandbox: e.target.checked});
	}

	onAdvancedClick = (e) => {
		this.setState({showAccordion: !this.state.showAccordion});
	}

	onKeyChange = (e, i) => {
		const {keyValuePairs} = this.state;
		let newKeyValuePairs = keyValuePairs.slice();

		if(newKeyValuePairs[i]) {
			newKeyValuePairs[i].key = e.target.value;
		} else {
			newKeyValuePairs[i] = {};
			newKeyValuePairs[i].key = e.target.value;
		}

		this.setState({keyValuePairs: newKeyValuePairs});
	}

	onValueChange = (e, i) => {
		const {keyValuePairs} = this.state;
		let newKeyValuePairs = keyValuePairs.slice();

		if(newKeyValuePairs[i]) {
			newKeyValuePairs[i].valueString = e.target.value;
		} else {
			newKeyValuePairs[i] = {};
			newKeyValuePairs[i].valueString = e.target.value;
		}

		this.setState({keyValuePairs: newKeyValuePairs});
	}

	addKeyValuePair = (i) => {
		const {keyValuePairs} = this.state;
		let newKeyValuePairs = keyValuePairs.slice();

		newKeyValuePairs[i + 1] = {key: '', valueString: ''};

		this.setState({keyValuePairs: newKeyValuePairs});
	}

	removeKeyValuePair = (i) => {
		const {keyValuePairs} = this.state;
		let newKeyValuePairs = keyValuePairs.slice();

		newKeyValuePairs.splice(i, 1);

		this.setState({keyValuePairs: newKeyValuePairs});
	}

	renderKeyValuePair (keyValuePair, i) {
		const {keyValuePairs} = this.state;

		const lastRow = (i === keyValuePairs.length - 1) || (i === 0 && keyValuePairs.length === 0);

		return (
			<div className="flex" key={i}>
				<label>
					<span>Key</span>
					<input key={i} className="title" type="text" placeholder={t('key')} value={keyValuePair.key} onChange={(e) => this.onKeyChange(e, i)} />
				</label>
				<label>
					<span>Value</span>
					<input key={i} className="title" type="text" placeholder={t('value')} value={keyValuePair.valueString} onChange={(e) => this.onValueChange(e, i)} />
				</label>
				{lastRow ? (
					<div className="add-icon" onClick={(e) => this.addKeyValuePair(i)}>
						<i className="icon-add"/>
					</div>
				) : (
					<div className="remove-icon" onClick={(e) => this.removeKeyValuePair(i)}>
						<i className="icon-remove"/>
					</div>
				)}
			</div>
		);
	}

	render () {
		const {value, saving, invalid, title, width, height, failedSave, allowFullScreen, sandbox, showAccordion, keyValuePairs} = this.state;

		const buttons = [
			{label: t('cancel'), onClick: () => this.onCancel()},
			{label: t('done'), onClick: () => this.onSave()}
		];

		return (
			<div className="content-picker-iframe-picker">
				<div className="picker">
					<h1 className="heading">{t('header')}</h1>
					<i className="icon-light-x" role="button" label="Close" title="Close" onClick={this.onCancel} />
					<label>
						<span>Link</span>
						<textarea className="link" type="text" placeholder={t('placeholder')} value={value} onChange={this.onInputChange} />
					</label>
					{value && !invalid && (
						<div>
							<label>
								<span>Title</span>
								<input className="title" type="text" placeholder={t('title')} value={title} onChange={this.onTitleChange} />
							</label>
							<div className="flex">
								<label>
									<span>Height</span>
									<input className="number" type="number" placeholder={t('height')} value={height} onChange={this.onHeightChange} />
								</label>
								<label>
									<span>Width</span>
									<input className="number" type="number" placeholder={t('width')} value={width} onChange={this.onWidthChange} />
								</label>
								<label>
									<span>Allow Fullscreen</span>
									<input className="checkbox" type="checkbox" checked={allowFullScreen} onChange={this.onFullScreenChange} />
								</label>
								<label>
									<span>Sandbox</span>
									<input className="checkbox" type="checkbox" checked={sandbox} onChange={this.onSandboxChange} />
								</label>
							</div>

							<div>
								<dt className={showAccordion ? 'advanced is-expanded' : 'advanced'} onClick={this.onAdvancedClick}>
									Advanced
								</dt>
								<dd className={showAccordion ? 'content is-expanded' : 'content'} >
									{keyValuePairs.length > 0 ? (
										keyValuePairs.map((keyValuePair, i) => {
											return this.renderKeyValuePair(keyValuePair, i);
										})
									) : (
										this.renderKeyValuePair({key: '', valueString: ''}, 0)
									)}
								</dd>
							</div>
						</div>
					)}

					{invalid && failedSave && (<span className="error">{t('invalid')}</span>)}
				</div>
				<DialogButtons buttons={buttons} />
				<div className={cx('saving-mask', {saving})}>
					{saving && <Loading.Spinner />}
				</div>
			</div>
		);
	}
}
