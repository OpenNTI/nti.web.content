import React from 'react';
import {scoped} from 'nti-lib-locale';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Bullet List'
};

const t = scoped('nti-content.editor.block-types.unordered-list.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.UNORDERED_LIST_ITEM,
		depth: 0,
		text: '',
		maintainSelection: true
	});
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
		/>
	);
}
