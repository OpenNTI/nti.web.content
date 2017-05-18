import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {ContentResources} from 'nti-web-commons';

import {Plugins, BLOCKS} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}

async function createBlock (insertBlock, {course}) {
	const accept = x => !x.isFolder && fileIsImage(x);

	const file = await ContentResources.selectFrom(course.getID(), accept);

	insertBlock({
		type: BLOCKS.ATOMIC,
		text: '',
		data: {
			name: 'course-figure',
			arguments: file.url,
			body: [],
			options: {local: true}
		}
	});
}

function isBlock (block) {
	const type = block.getType();
	const data = block.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === 'course-figure';
}

export default class CourseFigureButton extends React.Component {
	static propTypes = {
		course: PropTypes.object
	}

	state = {}


	onMouseDown = () => {
		this.setState({
			mousedown: true
		});
	}

	onMouseUp = () => {
		this.setState({
			mousedown: false
		});
	}

	render () {
		const {course} = this.props;
		const {mousedown} = this.state;
		const cls = cx('course-figure-button', {mousedown});

		return (
			<Button className={cls} createBlock={createBlock} createBlockProps={{course}} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragEnd={this.onMouseUp}>
				<BlockCount className="used" predicate={isBlock} />
				<span className="icon" />
				<span className="label">Photo</span>
			</Button>
		);
	}
}
