import React from 'react';
import {scoped} from '@nti/lib-locale';
import {BLOCKS} from '@nti/web-editor';

import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Bullet List'
};

const t = scoped('web-content.editor.block-types.unordered-list.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.UNORDERED_LIST_ITEM,
		depth: 0,
		text: ''
	}, false, true);
}

function isBlock (block) {
	return block.getType() === BLOCKS.UNORDERED_LIST_ITEM;
}

export default function UnorderedListItem () {
	return (
		<Button
			className="unordered-list-button"
			iconClass="content-editor-block-types-unordered-list-button"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
			group
		/>
	);
}
