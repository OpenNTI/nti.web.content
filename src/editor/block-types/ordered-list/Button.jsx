import React from 'react';
import {scoped} from 'nti-lib-locale';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Numbered List'
};

const t = scoped('nti-content.editor.block-types.order-list.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	insertBlock({
		type: BLOCKS.ORDERED_LIST_ITEM,
		depth: 0,
		text: ''
	});
}


function isBlock (block) {
	return block.getType() === BLOCKS.ORDERED_LIST_ITEM;
}


export default function OrderedListButton () {
	return (
		<Button
			className="ordered-list-button"
			iconClass="content-editor-block-types-ordered-list-button"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
		/>
	);
}
