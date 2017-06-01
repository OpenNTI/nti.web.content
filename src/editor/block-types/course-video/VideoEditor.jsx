import React from 'react';
import PropTypes from 'prop-types';
import Video from 'nti-web-video';
import {EmptyState} from 'nti-web-commons';

export default class VideoEditor extends React.Component {
	static propTypes = {
		url: PropTypes.string,
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
			const input = this.urlField.value.trim();
			if (!String(input).includes('<')) {
				return updateUrl(input);
			}

			const parsedUrl = this.parseEmbedCode(input);
			if (parsedUrl) {
				return updateUrl(parsedUrl);
			}
		}
	};

	onError = () => {
		this.setState({errorMsg: 'No video found. Try again.'});
	};

	onKeyDown = e => {
		if (e.key === 'Enter') {
			this.onDone(e);
		}
	};

	blankComponent = ({msg, onFocus, onBlur}) => (
		<div className="video-editor-blank" onClick={this.onClick}>
			<EmptyState header={msg} className="empty-string" />
			<div className="video-insert-options">
				<div className="video-link">
					<label htmlFor="urlField">Link</label>
					<div className="video-link-input">
						<input id="urlField" type="url" placeholder="Paste a link or embed code" ref={this.attachUrlRef} onFocus={onFocus} onKeyDown={this.onKeyDown} onBlur={onBlur} />
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
		</div>
	);

	innerComponent = ({url, msg, onFocus, onBlur}) => url && !this.state.errorMsg
		? <div className="editor-video-embed"><Video onError={this.onError} src={url} /></div>
		: (<this.blankComponent msg={msg} onFocus={onFocus} onBlur={onBlur} />);

	render () {
		const {url, onFocus, onBlur} = this.props;
		const emptyString = 'Enter a link to a YouTube, Vimeo or Kaltura video.';

		return (
			<div className="video-editor">
				<this.innerComponent url={url} msg={emptyString} onFocus={onFocus} onBlur={onBlur} />
			</div>
		);
	}
}
