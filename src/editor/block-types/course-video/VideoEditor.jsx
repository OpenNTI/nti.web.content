import url from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import {EmptyState} from 'nti-web-commons';
import Video from 'nti-web-video';

export default class VideoEditor extends React.Component {
	static propTypes = {
		src: PropTypes.string,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		updateUrl: PropTypes.func
	}

	parseEmbedCode = input => {
		const div = document.createElement('div');
		div.innerHTML = input;
		const iframe = div.querySelector('iframe');
		return iframe && iframe.src;
	};

	state = {};

	attachUrlRef = x => this.urlField = x;

	onClick = e => {
		e.stopPropagation();

		if (this.urlField) {
			this.urlField.focus();
		}
	};

	onDone = e => {
		e.stopPropagation();

		this.setState({errorMsg: ''});

		const {updateUrl} = this.props;

		if (this.urlField) {
			try {
				const input = this.urlField.value.trim();
				const parsedUrl = this.parseEmbedCode(input) || input;
				if (!url.parse(parsedUrl)) {
					throw new Error('Empty value');
				}
				updateUrl(parsedUrl);
			} catch (err) {
				this.onError(err);
			}
		}
	};

	onError = () => {
		const {updateUrl} = this.props;

		this.setState({errorMsg: 'No video found. Try again.'});

		updateUrl('');
	};

	onKeyDown = e => {
		const {onBlur} = this.props;
		if (e.key === 'Enter') {
			this.onDone(e);

			if (onBlur) {
				onBlur();
			}
		}
	};

	blankComponent = () => {
		const {onFocus, onBlur} = this.props;
		const msg = 'Enter a link to a YouTube, Vimeo or Kaltura video.';

		return (<div className="video-editor-blank" onClick={this.onClick}>
			<EmptyState header={msg} className="empty-string" />
			<div className="video-insert-options">
				<div className="video-link">
					<label htmlFor="urlField">Link</label>
					<div className="video-link-input">
						<input id="urlField" type="url" placeholder="Enter a link or embed code" ref={this.attachUrlRef} onFocus={onFocus} onKeyDown={this.onKeyDown} onBlur={onBlur} />
						<a onClick={this.onDone} role="button" className="nti-button primary rounded"><span>Done</span></a>
					</div>
				</div>
				<span className="error-message">{this.state.errorMsg}</span>
				{/*
				<div className="kaltura-options">
					<a><i className="icon-folder" />My Videos</a>
				</div>
				*/}
			</div>
		</div>);
	};

	innerComponent = () => {
		const {src} = this.props;
		return src && !this.state.errorMsg
			? <div className="editor-video-embed"><Video onError={this.onError} src={src} /></div>
			: this.blankComponent();
	};

	render () {

		return (
			<div className="video-editor">
				{this.innerComponent()}
			</div>
		);
	}
}
