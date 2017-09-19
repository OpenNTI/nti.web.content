import * as CourseFigure from './course-figure';
import * as CourseVideo from './course-video';
import * as CourseVideoRef from './course-video-ref';
import * as OrderedList from './ordered-list';
import * as UnorderedList from './unordered-list';

const TYPES = [
	CourseFigure,
	CourseVideo,
	CourseVideoRef,
	UnorderedList,
	OrderedList
];

export const Buttons = TYPES.reduce((acc, type) => {
	if (type.button) {
		acc.push(type.button);
	}

	return acc;
}, []);

export const CustomRenderers = TYPES.reduce((acc, type) => {
	if (type.component) {
		acc.push(type);
	}

	return acc;
}, []);

export const CustomStyles = TYPES.reduce((acc, type) => {
	if (type.className) {
		acc.push(type);
	}

	return acc;
}, []);
