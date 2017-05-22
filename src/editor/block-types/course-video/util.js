import {BLOCKS} from '../../../draft-core';

const NAME = 'ntivideo';

export const isVideoBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};
