export default function indexOfType (contentBlock, isOfType, editorState) {
	const blocks = editorState.getCurrentContent().getBlocksAsArray();
	let count = 0;

	for (let block of blocks) {
		if (isOfType(block)) {
			count += 1;
		}

		if (block === contentBlock) {
			break;
		}
	}

	return count;
}
