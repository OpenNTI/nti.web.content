import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {createMediaSourceFromUrl} from '@nti/web-video';
import {Prompt, DialogButtons, Loading} from '@nti/web-commons';
import {wait} from '@nti/lib-commons';

import {normalizeSource, parseEmbedCode} from './util';

const DEFAULT_TEXT = {
	header: 'Enter a link to a YouTube, Vimeo, or Kaltura video.',
	cancel: 'Cancel',
	done: 'Done',
	placeholder: 'Enter a link or embed code',
	invalid: 'Invalid Link'
};

const t = scoped('web-content.editor.block-types.course-video.Picker', DEFAULT_TEXT);


async function getMediaSource (rawInput) {
	const input = rawInput.trim();
	const url = parseEmbedCode(input) || input;
	const {service, source} = await createMediaSourceFromUrl(url);
	const normalizedSource = normalizeSource(service, source);

	return {service, source: normalizedSource};
}

export default class VideoPicker extends React.Component {
	static show (value) {
		return new Promise((fulfill, reject) => {
			Prompt.modal(
				<VideoPicker
					value={value}
					onSelect={fulfill}
					onCancel={reject}
				/>,
				'content-editor-video-picker-container'
			);
		});
	}

	static propTypes = {
		value: PropTypes.string,
		onSelect: PropTypes.func,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func
	}

	constructor (props) {
		super(props);

		const {value} = props;

		this.state = {
			value
		};
	}

	componentDidUpdate (prevProps) {
		const {value:nextValue} = this.props;
		const {value:prevValue} = prevProps;

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
		const {value} = this.state;
		const {onSelect, onDismiss} = this.props;

		this.setState({
			saving: true
		}, () => {
			getMediaSource(value)
				.then(wait.min(500))
				.then((source) => {
					if (onSelect) { onSelect(source); }

					onDismiss();
				})
				.catch(() => {
					this.setState({
						invalid: true,
						saving: false
					});
				});
		});
	}


	onInputChange = (e) => {
		this.setState({
			value: e.target.value,
			invalid: false
		});
	}


	render () {
		const {value, saving, invalid} = this.state;

		const buttons = [
			{label: t('cancel'), onClick: () => this.onCancel()},
			{label: t('done'), onClick: () => this.onSave()}
		];

		return (
			<div className="content-editor-video-picker">
				<div className="picker">
					<h1 className="heading">{t('header')}</h1>
					<label>
						<span>Link</span>
						<input type="text" placeholder={t('placeholder')} value={value} onChange={this.onInputChange} />
					</label>
					{invalid && (<span className="error">{t('invalid')}</span>)}
				</div>
				<DialogButtons buttons={buttons} />
				<div className={cx('saving-mask', {saving})}>
					{saving && <Loading.Spinner />}
				</div>
			</div>
		);
	}
}
