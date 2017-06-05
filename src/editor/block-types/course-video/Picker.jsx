import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import {Prompt, DialogButtons} from 'nti-web-commons';

const DEFAULT_TEXT = {
	header: 'Enter a link to a YouTube, Vimeo, or Kaltura video.',
	cancel: 'Cancel',
	done: 'Done',
	placeholder: 'Enter a link or embed code'
};

const t = scoped('nti-content.editor.block-types.course-video.Picker', DEFAULT_TEXT);

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

	componentWillReceiveProps (nextProps) {
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
		const {value} = this.state;
		const {onSelect, onDismiss} = this.props;

		onDismiss();

		if (onSelect) {
			onSelect(value);
		}
	}


	onInputChange = (e) => {
		this.setState({
			value: e.target.value
		});
	}


	render () {
		const {value} = this.state;

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
				</div>
				<DialogButtons buttons={buttons} />
			</div>
		);
	}
}
