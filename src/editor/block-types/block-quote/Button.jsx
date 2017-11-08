import React from 'react';
import {scoped} from 'nti-lib-locale';

import {BLOCKS} from '../../../draft-core';
import Button from '../common/Button';

const DEFAULT_TEXT = {
	label: 'Block Quote'
};

const t = scoped('nti-content.editor.block-types.block-quote.button', DEFAULT_TEXT);

function createBlock (insertBlock) {
	debugger;
	insertBlock({
		type: BLOCKS.BLOCKQUOTE,
		depth: 1,
		text: ''
	}, false, true);
}

function isBlock (block) {
	debugger;
	return block.getType() === BLOCKS.BLOCKQUOTE;
}

export default function UnorderedListItem () {
	return (
		<Button
			className="block-quote-button"
			iconClass="content-editor-block-types-block-quote-button"
			label={t('label')}
			createBlock={createBlock}
			isBlockPredicate={isBlock}
			group
		/>
	);
}
