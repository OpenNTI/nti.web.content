import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Prompt, DialogButtons, Loading, Input, Panels, Checkbox} from '@nti/web-commons';

import Advanced from './advanced';

const DEFAULT_TEXT = {
	header: 'Enter a link to an Iframe.',
	cancel: 'Cancel',
	done: 'Done',
	invalid: 'Invalid Link. Please check your input and make sure your link is secure (https).',
	link: {
		label: 'Link Or Embed Code',
		placeholder: 'Enter a link or embed code'
	},
	title: {
		label: 'Title',
		placeholder: 'Title'
	},
	height: {
		label: 'Height',
		placeholder: 'Height'
	},
	width: {
		label: 'Width',
		placeholder: 'Width'
	},
	allowFullScreen: 'Allow Full Screen',
	sandbox: 'Sandbox',
	key: 'Key',
	value: 'Value'
};

const t = scoped('web-content.editor.block-types.iframe.Picker', DEFAULT_TEXT);


function getStateForValue (value = {}) {
	const nonAdvanced = ['title', 'height', 'width', 'no-sandboxing', 'allowfullscreen'];
	const attributes = value.attributes || {};
	const advancedProperties = {...(attributes || {})};

	for (let prop of nonAdvanced) {
		delete advancedProperties[prop];
	}

	return {
		link: value.src || '',
		title: attributes.title || '',
		height: parseInt(attributes.height, 10) || '',
		width: parseInt(attributes.width, 10) || '',
		sandbox: attributes['no-sandboxing'] === 'false' || false,
		allowFullScreen: attributes.allowfullscreen === 'true' || false,
		advancedProperties
	};
}

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

		this.state = getStateForValue(value);
	}


	componentDidUpdate (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:prevValue} = this.props;

		if (nextValue !== prevValue) {
			this.setState(getStateForValue(nextValue));
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
		const {link, width, height, title, invalid, allowFullScreen, sandbox, advancedProperties} = this.state;
		const {onSelect, onDismiss} = this.props;
		const noSandbox = !sandbox;

		let attributes = {
			...advancedProperties,
			width,
			height,
			allowfullscreen: allowFullScreen.toString(),
			'no-sandboxing': noSandbox.toString()
		};

		if(title) {
			attributes.title = title;
		}

		if(invalid) {
			this.setState({
				failedSave: true
			});
		} else {
			this.setState({
				failedSave: false,
				saving: true
			}, () => {
				onSelect({src: link, attributes});
				onDismiss();
			});
		}
	}


	onLinkChange = (value) => {
		const secureUrl = /^(https:\/\/www\.|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
		const isUrl = secureUrl.test(value);

		if(isUrl) {
			this.setState({
				link: value,
				invalid: false
			});
		} else {
			const div = document.createElement('div');
			div.innerHTML = value;
			const iframe = div.querySelector('iframe');

			const nonAdvanced = ['src', 'title', 'height', 'width', 'no-sandboxing', 'allowfullscreen'];
			const attributes = iframe ? iframe.attributes : {};
			let advancedProperties = {};

			for(let attribute of Array.from(attributes)) {
				if(attribute) {
					advancedProperties[attribute.name] = attribute.value || true;
				}
			}

			for (let prop of nonAdvanced) {
				delete advancedProperties[prop];
			}

			let width = iframe ? iframe.getAttribute('width') : '';
			let height = iframe ? iframe.getAttribute('height') : '';
			const title = iframe ? iframe.getAttribute('title') : '';
			const allowFullScreen = iframe && iframe.hasAttribute('allowfullscreen');
			const sandbox = iframe && iframe.hasAttribute('sandbox');
			const src = iframe && iframe.src;

			width = width > 671 ? 671 : width;
			height = height > 400 ? 400 : height;

			if(src && secureUrl.test(src)) {
				this.setState({
					link: src,
					width,
					height,
					title,
					allowFullScreen,
					sandbox,
					advancedProperties,
					invalid: false
				});
			} else {
				this.setState({
					link: value,
					invalid: true
				});
			}
		}
	}

	onWidthChange = (width) => {
		width = width > 671 ? 671 : width;

		this.setState({width});
	}

	onHeightChange = (height) => {
		height = height > 400 ? 400 : height;

		this.setState({height});
	}

	onTitleChange = (title) => {
		this.setState({title});
	}

	onFullScreenChange = (e) => {
		this.setState({allowFullScreen: e.target.checked});
	}

	onSandboxChange = (e) => {
		this.setState({sandbox: e.target.checked});
	}


	onAdvancedPropertiesChange = (properties) => {
		this.setState({
			advancedProperties: properties
		});
	}


	onAdvancedValidityChange = (valid) => {
		this.setState({
			advancedInvalid: !valid
		});
	}


	render () {
		const {
			link,
			saving,
			invalid,
			title,
			width,
			height,
			allowFullScreen,
			sandbox,
			advancedProperties,
			advancedInvalid
		} = this.state;

		const buttons = [
			{label: t('cancel'), onClick: this.onCancel},
			{label: t('done'), disabled: advancedInvalid || invalid, onClick: this.onSave}
		];

		return (
			<div className="content-picker-iframe-picker">
				<Panels.TitleBar title={t('header')} iconAction={this.onCancel} />
				<div className="picker">
					<Input.Label className="link-label" label={t('link.label')}>
						<Input.TextArea className="link" placeholder={t('link.placeholder')} value={link} onChange={this.onLinkChange} />
					</Input.Label>
					{link && !invalid && (
						<>
							<Input.Label className="title-label" label={t('title.label')}>
								<Input.Text className="title" placeholder={t('title.placeholder')} value={title || ''} onChange={this.onTitleChange} />
							</Input.Label>
							<div className="sizes">
								<Input.Label className="width-label" label={t('width.label')}>
									<Input.Number value={width} placeholder={t('width.placeholder')} min={0} max={671} onChange={this.onWidthChange} />
								</Input.Label>
								<Input.Label className="height-label" label={t('height.label')}>
									<Input.Number value={height} placeholder={t('height.placeholder')} min={0} max={500} onChange={this.onHeightChange} />
								</Input.Label>
							</div>
							<Checkbox checked={allowFullScreen} onChange={this.onFullScreenChange} className="allow-full-screen" label={t('allowFullScreen')}/>
							<Checkbox checked={sandbox} onChange={this.onSandboxChange} className="sandbox" label={t('sandbox')}/>
						</>
					)}
					{invalid && (<span className="error">{t('invalid')}</span>)}
				</div>
				{link && !invalid && (
					<Advanced
						properties={advancedProperties}
						onChange={this.onAdvancedPropertiesChange}
						onValidityChange={this.onAdvancedValidityChange}
					/>
				)}
				<DialogButtons buttons={buttons} />
				<div className={cx('saving-mask', {saving})}>
					{saving && <Loading.Spinner />}
				</div>
			</div>
		);
	}
}
