import React from 'react';
import PropTypes from 'prop-types';

import {ContentResources} from 'nti-web-commons';

import {Plugins, BLOCKS} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}

function createBlock (insertBlock, {course}) {
	const accept = x => !x.isFolder && fileIsImage(x);

	ContentResources.selectFrom(course.getID(), accept)
		.then((file) => {
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
		});

}

function isBlock (block) {
	const type = block.getType();
	const data = block.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === 'course-figure';
}

CourseFigureButton.propTypes = {
	course: PropTypes.object
};
export default function CourseFigureButton ({course}) {
	return (
		<Button className="course-figure-button" createBlock={createBlock} createBlockProps={{course}}>
			<BlockCount predicate={isBlock}/>
			<span className="label">Photo</span>
		</Button>
	);
}
