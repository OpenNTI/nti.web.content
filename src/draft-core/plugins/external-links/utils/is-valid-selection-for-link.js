function validBlock (block, allowedTypes) {
	const type = block.getType();

	for (let allowed of allowedTypes) {
		if (type === allowed) {
			return true;
		}
	}

	return false;
}

function containsOnlyAllowedTypes (selection, content, allowedTypes) {
	const startKey = selection.getStartKey();
	const endKey = selection.getEndKey();

	let block = content.getBlockForKey(startKey);

	if (!validBlock(block, allowedTypes)) { return false; }

	if (startKey === endKey) { return true; }

	block = content.getBlockAfter(startKey);

	while (block.key !== endKey) {
		if (!validBlock(block, allowedTypes)) { return false; }

		block = content.getBlockAfter(block.key);
	}

	block = content.getBlockForKey(endKey);

	if (!validBlock(block, allowedTypes)) { return false; }

	return true;
}

export default function isValidSelectionForLink (editorState, allowedTypes) {
	const selection = editorState.getSelection();

	//If there is no selection or its collapsed its not
	//a valid selection for a link
	if (!selection || selection.isCollapsed()) { return false; }

	return allowedTypes ? containsOnlyAllowedTypes(selection, editorState.getCurrentContent(), allowedTypes) : true;
}
