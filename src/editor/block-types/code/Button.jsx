import React from 'react';
import {scoped} from 'nti-lib-locale';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Code'
};

const t = scoped('nti-content.editor.block-types.code.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.ATOMIC,
		text: '',
		data: {
			name: 'code-block',
			arguments: 'Javascript',
			body: [],
			options: {}
		},
	}, false, true);
}

function isBlock (block) {
	const type = block.getType();
	const data = block.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === 'code-block';
}

export default function UnorderedListItem () {
	return (
		<Button
			className="code-button"
			iconClass="content-editor-block-types-code-button"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
			group
		/>
	);
}
