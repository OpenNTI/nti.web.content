import {BLOCKS} from '../../../draft-core';

import Button from './Button';
import Editor from './Editor';

const NAME = 'course-figure';

export const handlesBlock = (contentBlock) => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const className = 'nti-course-figure-block';

export const button = Button;

export const component = Editor;
export const editable = false;
