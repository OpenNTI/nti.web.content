import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Video, {Editor} from '@nti/web-video';
import {getService} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

import {VIDEO_DELETED_EVENT, addListener, removeListener, emitEvent} from '../Events';
import {
	Controls,
	onRemove,
} from '../course-common';

const DEFAULT_TEXT = {
	Controls: {
		changeImage: 'Edit Video'
	}
};

const getString = scoped('web-content.editor.block-types.course-video.VideoEditor', DEFAULT_TEXT);

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

	constructor (props) {
		super(props);

		this.state = {
			isEditing: false,
			video: null
		};
	}

	componentWillMount () {
		this.getStateFor()
			.then(state => {
				this.setState({ ...state });
			});

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
			this.setState({deleted: true});
		}
	}

	async getStateFor (props = this.props) {
		const { block } = props;
		const data = block.getData();
		const videoNTIID = data.get('arguments');
		const video = await this.resolveVideo(videoNTIID);
		return {
			video,
			isEditing: false
		};
	}

	componentWillReceiveProps (nextProps) {
		const { block: newBlock } = nextProps;
		const { block: oldBlock } = this.props;

		if (newBlock !== oldBlock) {
			this.getStateFor(nextProps)
				.then(state => {
					this.setState({ ...state });
				});
		}
	}

	async resolveVideo (ntiid) {
		const service = await getService();
		const video = await service.getObject(ntiid);
		return video;
	}

	onRemove = () => onRemove(this.props);

	onChange = () => {
		const { video } = this.state;

		Editor.show(video,
			{
				title: 'Video Editor',
				restoreScroll: true
			},
			{ onVideoDelete: (deletedVideo) => {
				this.onRemove();

				emitEvent(VIDEO_DELETED_EVENT, deletedVideo.getID());
			}})
			.then(newVideo => {
				this.setState({
					video: newVideo,
					editing: false
				});
			});
	}

	render () {
		const {isEditing, video, deleted } = this.state;
		const isMissing = deleted || !video;
		const onChange = isMissing ? null : this.onChange;

		return (
			<div className="course-video-editor no-user-select">
				<Controls onRemove={this.onRemove} onChange={onChange} getString={getString} iconName="icon-edit" />
				{(!isEditing && video && !deleted) && (
					<div className="video-wrap">
						<Video src={video} />
						<div className="video-title">{ video.title }</div>
					</div>
				)}
				{
					(isMissing) && (
						<div className="video-missing">This video has been deleted</div>
					)
				}
			</div>
		);
	}
}
