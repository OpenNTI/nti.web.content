import React from 'react';
import PropTypes from 'prop-types';
import {Component as Video} from 'nti-web-video';
import {EmptyState} from 'nti-web-commons';

export default class VideoEditor extends React.Component {
	static propTypes = {
		url: PropTypes.string,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		updateUrl: PropTypes.func
	}

	attachUrlRef = x => this.urlField = x;

	onClick = e => {
		e.stopPropagation();

		if (this.urlField) {
			this.urlField.focus();
		}
	};

	onDone = e => {
		const {updateUrl} = this.props;

		if (this.urlField) {
			updateUrl(this.urlField.value);
		}
	};

	blankComponent = ({msg, onFocus, onBlur}) => (
		<div className="video-editor-blank" onClick={this.onClick}>
			<EmptyState header={msg} className="empty-string" />
			<div className="video-insert-options">
				<div className="video-link">
					<label htmlFor="urlField">Link</label>
					<div className="video-link-input">
						<input id="urlField" type="url" placeholder="Paste a link and hit enter" ref={this.attachUrlRef} onFocus={onFocus} onBlur={onBlur} />
						<a onClick={this.onDone} role="button" className="nti-button primary rounded"><span>Done</span></a>
					</div>
				</div>
				{/*
				<div className="kaltura-options">
					<a><i className="icon-folder" />My Videos</a>
					<a><i className="icon-upload" />Upload a Video</a>
				</div>
				*/}
			</div>
		</div>
	);

	innerComponent = ({url, msg, onFocus, onBlur}) => url ?
		<div className="editor-video-embed"><Video src={url} /></div> :
		(<this.blankComponent msg={msg} onFocus={onFocus} onBlur={onBlur} />);

	render () {
		const {url, onFocus, onBlur} = this.props;
		// const emptyString = 'Enter a link to a YouTube, Vimeo or Kaltura video.';
		const emptyString = 'Enter a link to a YouTube or Vimeo video.';

		return (
			<div className="video-editor">
				<this.innerComponent url={url} msg={emptyString} onFocus={onFocus} onBlur={onBlur} />
			</div>
		);
	}
}
