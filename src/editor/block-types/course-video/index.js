import {isVideoBlock} from './util';
import Button from './Button';
import Editor from './Editor';


export default {
	handlesBlock: contentBlock => isVideoBlock(contentBlock),
	className: 'nti-course-video-block',
	editable: false,
	button: Button,
	component: Editor
};
