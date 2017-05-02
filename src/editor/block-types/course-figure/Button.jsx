import React from 'react';

import {Plugins} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

function createBlock (insertBlock) {
	debugger;
}

export default function CourseFigureButton () {
	return (
		<Button createBlock={createBlock}>
			<BlockCount />
			<span>Course Figure Button</span>
		</Button>
	);
}
