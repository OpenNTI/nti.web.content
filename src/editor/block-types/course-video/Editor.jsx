import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {createMediaSourceFromUrl, getCanonicalUrlFrom} from '@nti/web-video';

import {VIDEO_DELETED_EVENT, addListener, removeListener} from '../Events';
import {
	CaptionEditor,
	Controls,
	onRemove,
	onFocus,
	onBlur,
	onCaptionChange
} from '../course-common';

import VideoEditor from './VideoEditor';

const DEFAULT_TEXT = {
	Editor: {
		videoTitle: 'Video %(index)s',
		descriptionPlaceholder: 'Write a caption...'
	}
};

const getString = scoped('web-content.editor.block-types.course-video.VideoEditor', DEFAULT_TEXT);

const blockType = {
	getString,
	regex: /^Video\s\d$/,
	getTitle: index => getString('Editor.videoTitle', {index: index + 1})
};

export default class CourseVideoEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func
		})
	};

	onChange = null;

	attachCaptionRef = x => this.caption = x

	constructor (props) {
		super(props);

		this.state = this.computeState(props);
		addListener(VIDEO_DELETED_EVENT, this.onDelete);
	}

	componentWillUnmount () {
		removeListener(VIDEO_DELETED_EVENT, this.onDelete);
	}

	onDelete = (videoId) => {
		const { block } = this.props;
		const data = block.getData();
		const videoNTIID = data.get('arguments');

		if(videoId === videoNTIID) {
			this.onRemove();
		}
	}


	computeState (props = this.props) {
		const {block} = props;
		const data = block.getData();
		const body = data.get('body');
		const blockArguments = data.get('arguments');

		const url = (this.state && this.state.url)
			|| getCanonicalUrlFrom(blockArguments);

		return {
			url: url,
			body: body.toJS ? body.toJS() : body
		};
	}


	componentDidUpdate (prevProps) {
		const {block:newBlock} = this.props;
		const {block:oldBlock} = prevProps;

		if (newBlock !== oldBlock) {
			this.setState(this.computeState());
		}
	}


	onClick = e => {
		e.stopPropagation();

		if (this.caption) {
			this.caption.focus();
		}
	};


	onRemove = () => onRemove(this.props);
	onFocus = () => onFocus(this.props);
	onBlur = () => onBlur(this.props);
	onCaptionChange = (body, doNotKeepSelection) => onCaptionChange(body, doNotKeepSelection, this.props);

	normalizeSource = (service, source) => {
		if (!/kaltura/i.test(service)) {
			return source;
		}

		const [providerId, entryId] = source.split('/');
		if (providerId && entryId) {
			return `${providerId}:${entryId}`;
		}

		return source;
	};

	updateFromMediaSource = ({service, source, href}) => {
		const {blockProps:{setBlockData}} = this.props;
		const normalSource = this.normalizeSource(service, source);

		setBlockData({arguments: `${service} ${normalSource}`});
		this.setState({url: href});
	};


	updateUrl = inputUrl => {
		const {blockProps:{setBlockData}} = this.props;

		if (inputUrl) {
			createMediaSourceFromUrl(inputUrl)
				.then(mediaSource => mediaSource && this.updateFromMediaSource(mediaSource))
				.catch(() => {});
		} else {
			setBlockData({arguments: ''});
		}
	};


	render () {
		const {block, blockProps:{indexOfType}} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-video-editor">
				<Controls onRemove={this.onRemove} onChange={this.onChange} />
				<VideoEditor updateUrl={this.updateUrl} src={url} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor
					ref={this.attachCaptionRef}
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
					indexOfType={indexOfType}
					blockType={blockType}
					onClick={this.onClick}
				/>
			</div>
		);
	}
}
