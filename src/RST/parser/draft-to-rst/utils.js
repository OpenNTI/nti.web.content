import uuid from 'node-uuid';

function generateUID () {
	const id = uuid.v4();

	return id.replace(/-/g, '');
}

function getUIDForBlock (block) {
	return (block && block.data && block.data.UID) || generateUID();
}


export function getUIDStringFor (block) {
	return `.. uid:: ${getUIDForBlock(block)}\n.. UID applied to the block below for anchoring\n`;
}
