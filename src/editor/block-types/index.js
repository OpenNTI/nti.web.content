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
