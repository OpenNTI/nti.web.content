import React from 'react';
import {scoped} from '@nti/lib-locale';
import {BLOCKS} from '@nti/web-editor';

import Button from '../common/Button';

const t = scoped('web-content.editor.block-types.sidebar.button', {
	label: 'Call Out'
});

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.ATOMIC,
		text: '',
		data: {
			name: 'sidebar',
			arguments: '',
			body: [],
			options: {}
		}
	});
}

function isBlock (block) {
	const type = block.getType();
	const data = block.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === 'sidebar';
}

export default function SidebarButton () {
	return (
		<Button
			className="content-editor-sidebar-button"
			iconClass="content-editor-block-types-sidebar-icon"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
		/>
	);
}
