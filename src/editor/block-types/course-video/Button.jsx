import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {createMediaSourceFromUrl} from 'nti-web-video';

import {Plugins, BLOCKS} from '../../../draft-core';

import {isVideoBlock} from './util';
import Picker from './Picker';

const {Button, BlockCount} = Plugins.InsertBlock.components;

function createBlock (insertBlock) {
	Picker.show()
		.then((video) => {
			return createMediaSourceFromUrl(video);
		})
		.then(({service, source}) => {
			insertBlock({
				type: BLOCKS.ATOMIC,
				text: '',
				data: {
					name: 'ntivideo',
					body: [],
					arguments: `${service} ${source}`,
					options: {}
				}
			});
		});
}

// const createBlock = insertBlock => insertBlock({
// 	type: BLOCKS.ATOMIC,
// 	text: '',
// 	data: {
// 		name: 'ntivideo',
// 		body: [],
// 		arguments: '',
// 		options: {}
// 	}
// });

export default class CourseVideoButton extends React.Component {
	static propTypes = {
		course: PropTypes.object
	};

	state = {};

	onMouseDown = () => this.setState({
		mousedown: true
	});

	onMouseUp = () => this.setState({
		mousedown: false
	});

	render () {
		const {course} = this.props;
		const {mousedown} = this.state;
		const cls = cx('course-video-button', {mousedown});

		return (
			<Button className={cls} createBlock={createBlock} createBlockProps={{course}} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragEnd={this.onMouseUp}>
				<BlockCount className="used" predicate={isVideoBlock} />
				<span className="icon" />
				<span className="label">Embed Video</span>
			</Button>
		);
	}
}
