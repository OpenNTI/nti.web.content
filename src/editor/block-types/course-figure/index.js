import {BLOCKS} from '../../../draft-core';

import Button from './Button';
import Editor from './Editor';

const NAME = 'course-figure';

export default {
	handlesBlock: (contentBlock) => {
		const type = contentBlock.getType();
		const data = contentBlock.getData();

		return type === BLOCKS.ATOMIC && data.get('name') === NAME;
	},

	className: 'nti-course-figure-block',

	button: Button,

	component: Editor,
	editable: false
};
