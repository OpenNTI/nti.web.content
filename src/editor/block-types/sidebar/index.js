import {BLOCKS} from '@nti/web-editor';

import Editor from './Editor';
import Button from './Button';

const NAME = 'sidebar';

export const handlesBlock = (contentBlock) => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const className = 'nti-sidebar';
export const component = Editor;
export const button = Button;
export const editable = false;

