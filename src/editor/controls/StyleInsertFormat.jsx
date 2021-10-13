import './StyleInsertFormat.scss';
import { BLOCK_TYPE } from 'draft-js-utils';

import {
	BoldButton,
	ItalicButton,
	UnderlineButton,
	LinkButton,
} from '@nti/web-editor';

const DISABLE_FOR_BLOCKS = {
	[BLOCK_TYPE.HEADER_ONE]: true,
	[BLOCK_TYPE.HEADER_TWO]: true,
	[BLOCK_TYPE.HEADER_THREE]: true,
	[BLOCK_TYPE.HEADER_FOUR]: true,
	[BLOCK_TYPE.ATOMIC]: true,
};

function shouldDisableForState(state) {
	if (!state) {
		return false;
	}

	const selection = state.getSelection();
	const start = selection.getStartKey();
	const end = selection.getEndKey();

	if (start !== end) {
		return false;
	}

	const content = state.getCurrentContent();
	const block = content.getBlockForKey(start);

	return block && DISABLE_FOR_BLOCKS[block.getType()];
}

export default function ContentEditorFormatting() {
	return (
		<div className="content-editor-style-format">
			<div className="styles">
				<BoldButton shouldDisableForState={shouldDisableForState} />
				<ItalicButton shouldDisableForState={shouldDisableForState} />
				<UnderlineButton
					shouldDisableForState={shouldDisableForState}
				/>
			</div>
			<div className="entities">
				<LinkButton />
			</div>
		</div>
	);
}
