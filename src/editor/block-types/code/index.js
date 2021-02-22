import { BLOCKS } from '@nti/web-editor';

import Button from './Button';
import Editor from './Editor';

const NAME = 'code-block';

export const handlesBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const className = 'nti-code-block';
export const component = Editor;
export const button = Button;
export const editable = false;
