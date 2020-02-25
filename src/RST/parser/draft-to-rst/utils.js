import {v4 as uuid} from 'uuid';

function generateUID () {
	const id = uuid();

	return id.replace(/-/g, '');
}

function getUIDForBlock (block) {
	return (block && block.data && block.data.UID) || generateUID();
}


export function getUIDStringFor (block) {
	return `.. uid:: ${getUIDForBlock(block)}\n.. UID applied to the block below for anchoring\n`;
}


export function getLabelFor (block) {
	const label = block && block.data && block.data.label;

	if (!label) { return ''; }

	return `.. label:: ${label}\n.. Label applied to keep a consistant readable name on sections`;
}
