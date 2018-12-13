import {BLOCKS} from '@nti/web-editor';

const NAME = 'nti:embedwidget';

export const isIframeRefBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};
