import {BLOCKS} from '../../../draft-core';

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
