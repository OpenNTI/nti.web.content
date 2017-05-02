import React from 'react';

import {Plugins} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

export default function CourseFigureButton () {
	return (
		<Button>
			<BlockCount />
			<span>Course Figure Button</span>
		</Button>
	);
}
