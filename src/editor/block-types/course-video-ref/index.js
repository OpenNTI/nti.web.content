import {isVideoRefBlock} from './util';
import Button from './Button';
import Editor from './Editor';


export const handlesBlock = contentBlock => isVideoRefBlock(contentBlock);
export const className = 'nti-course-video-block';
export const editable = false;
export const button = Button;
export const component = Editor;
