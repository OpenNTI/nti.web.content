import {BLOCKS} from '@nti/web-editor';

import Editor from './Editor';
import Button from './Button';
import BodyEditor from './parts/BodyEditor';

const NAME = 'sidebar';

export const handlesBlock = (contentBlock) => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const getNestedState = (contentBlock) => {
	if (handlesBlock(contentBlock)) {
		const key = contentBlock.getKey();

		return BodyEditor.BLOCK_ID_TO_BODY_STATE[key];
	}
};

export const className = 'nti-sidebar';
export const component = Editor;
export const button = Button;
export const editable = false;


