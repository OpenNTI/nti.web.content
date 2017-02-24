import uuid from 'node-uuid';

function getDocIDForBlock (block) {
	return (block && block.data && block.data.DocID) || uuid.v4();
}


export function getDocIDStringFor (block) {
	return `.. docid:: ${getDocIDForBlock(block)}`;
}
