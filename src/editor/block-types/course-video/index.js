import { isVideoBlock } from './util';
import Editor from './Editor';

export const handlesBlock = contentBlock => isVideoBlock(contentBlock);
export const className = 'nti-course-video-block';
export const editable = false;
export const component = Editor;
