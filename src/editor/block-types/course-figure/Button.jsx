import React from 'react';

import {Plugins, BLOCKS} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.ATOMIC,
		text: '',
		data: {
			name: 'course-figure',
			arguments: '',
			body: [],
			options: {}
		}
	});
}

export default function CourseFigureButton () {
	return (
		<Button createBlock={createBlock}>
			<BlockCount />
			<span>Course Figure Button</span>
		</Button>
	);
}
