import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import {EmbedInput} from 'nti-web-video';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

import {isVideoBlock} from './util';

const DEFAULT_TEXT = {
	label: 'Embed Video'
};

const t = scoped('nti-cotent.editor.block-types.course-figure.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	EmbedInput.show()
		.then(({service, source}) => {
			insertBlock({
				type: BLOCKS.ATOMIC,
				text: '',
				data: {
					name: 'ntivideo',
					body: [],
					arguments: `${service} ${source}`,
					options: {}
				}
			});
		});
}

CourseVideoButton.propTypes = {
	course: PropTypes.object
};
export default function CourseVideoButton ({course}) {
	return (
		<Button
			className="course-video-button"
			iconClass="content-editor-block-types-video-button"
			label={t('label')}
			createBlock={createBlock}
			createBlockProps={{course}}
			isBlockPredicate={isVideoBlock}
		/>
	);
}

