import CourseFigure from './course-figure';

const TYPES = [
	CourseFigure
];

export const Buttons = TYPES.reduce((acc, type) => {
	if (type.button) {
		acc.push(type.button);
	}

	return acc;
}, []);

export const CustomRenders = TYPES.reduce((acc, type) => {
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
