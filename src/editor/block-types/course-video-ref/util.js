import {BLOCKS} from 'nti-web-editor';

const NAME = 'ntivideoref';
const LEGACY_NAME = 'ntivideo';

export const isVideoRefBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
};

export const isAnyVideoTypeRefBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && (data.get('name') === NAME || data.get('name') === LEGACY_NAME);
};

export const normalizeSource = (service, source) => {
	if (!/kaltura/i.test(service)) {
		return source;
	}

	const [providerId, entryId] = source.split('/');
	if (providerId && entryId) {
		return `${providerId}:${entryId}`;
	}

	return source;
};

export const parseEmbedCode = input => {
	const div = document.createElement('div');
	div.innerHTML = input;
	const iframe = div.querySelector('iframe');
	return iframe && iframe.src;
};
