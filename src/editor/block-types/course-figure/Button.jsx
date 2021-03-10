import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { ContentResources } from '@nti/web-commons';
import { BLOCKS } from '@nti/web-editor';

import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Photo',
};

const t = scoped(
	'web-content.editor.block-types.course-figure.button',
	DEFAULT_TEXT
);

function fileIsImage(file) {
	return /image\//i.test(file.FileMimeType);
}

async function createBlock(insertBlock, { course }) {
	const accept = x => !x.isFolder && fileIsImage(x);

	const file = await ContentResources.selectFrom(course.getID(), accept);

	insertBlock({
		type: BLOCKS.ATOMIC,
		text: '',
		data: {
			name: 'course-figure',
			arguments: file.url,
			body: [],
			options: { local: true },
		},
	});
}

function isBlock(block) {
	const type = block.getType();
	const data = block.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === 'course-figure';
}

CourseFigureButton.propTypes = {
	course: PropTypes.object,
};
export default function CourseFigureButton({ course }) {
	return (
		<Button
			className="course-figure-button"
			iconClass="content-editor-block-types-course-figure-icon"
			label={t('label')}
			createBlock={createBlock}
			createBlockProps={{ course }}
			isBlockPredicate={isBlock}
		/>
	);
}
