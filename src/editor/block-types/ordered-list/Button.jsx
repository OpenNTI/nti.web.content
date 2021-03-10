import './Button.scss';
import React from 'react';

import { scoped } from '@nti/lib-locale';
import { BLOCKS } from '@nti/web-editor';

import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Numbered List',
};

const t = scoped(
	'web-content.editor.block-types.order-list.button',
	DEFAULT_TEXT
);

function createBlock(insertBlock) {
	insertBlock(
		{
			type: BLOCKS.ORDERED_LIST_ITEM,
			depth: 0,
			text: '',
		},
		false,
		true
	);
}

function isBlock(block) {
	return block.getType() === BLOCKS.ORDERED_LIST_ITEM;
}

export default function OrderedListButton() {
	return (
		<Button
			className="ordered-list-button"
			iconClass="content-editor-block-types-ordered-list-button"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
			group
		/>
	);
}
