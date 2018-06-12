import {BLOCKS} from '@nti/web-editor';

import Editor from './Editor';

const NAME = 'sidebar';

export const handlesBlock = (contentBlock) => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const className = 'nti-sidebar';
export const component = Editor;
export const editable = false;

