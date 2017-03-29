function getStartAndEnd (selection) {
	let start = selection.getStartOffset();
	let end = selection.getEndOffset();

	//TODO: adjust the start and end indexes we look
	//at to feel more natural

	return {start, end};
}

export default function getSelectedEntityKey (editorState) {
	const selection = editorState.getSelection();

	if (!selection.getHasFocus()) { return void 0; }

	const content = editorState.getCurrentContent();
	const currentBlock = content.getBlockForKey(selection.getStartKey());
	const {start, end} = getStartAndEnd(selection);

	let entityKey = void 0;

	for (let i = start; i <= end; i++) {
		let currentEntity = currentBlock.getEntityAt(i);

		//if a character is selected that doesn't have an entity return no entity
		if (!currentEntity) {
			entityKey = void 0;
			break;
		}

		//if we just started set the entity as the current one
		if (i === start) {
			entityKey = currentEntity;
		//if we get an entity thats different from the other characters, there is more than one
		//so say there is no selected entity
		} else if (entityKey !== currentEntity) {
			entityKey = void 0;
			break;
		}
	}

	return entityKey;
}
