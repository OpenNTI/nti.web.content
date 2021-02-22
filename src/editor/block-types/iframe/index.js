import { isIframeRefBlock } from './util';
import Button from './Button';
import Editor from './Editor';

export const handlesBlock = contentBlock => {
	return isIframeRefBlock(contentBlock);
};
export const className = 'nti-course-iframe-block';
export const editable = false;
export const button = Button;
export const component = Editor;
