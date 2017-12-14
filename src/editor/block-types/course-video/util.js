import {BLOCKS} from 'nti-web-editor';

const NAME = 'ntivideo';

export const isVideoBlock = contentBlock => {
	const type = contentBlock.getType();
	const data = contentBlock.getData();

	return type === BLOCKS.ATOMIC && data.get('name') === NAME;
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
