import {Entity} from 'draft-js';
import {ENTITY_TYPE} from 'draft-js-utils';

export function getCurrentLink (editorState) {
	const selection = editorState.getSelection();
	const content = editorState.getCurrentContent();
	const currentBlock = content.getBlockForKey(selection.getStartKey());
	let currentLink = void 0;

	currentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();

		return entityKey !== null && Entity.get(entityKey).getType() === ENTITY_TYPE.LINK;
	}, (start, end) => {
		if (
				currentBlock.getKey() === selection.getAnchorKey() &&
				selection.getAnchorKey() === selection.getFocusKey() &&
				selection.getAnchorOffset() >= start &&
				selection.getFocusOffset() <= end
			) {
			currentLink = true;
		}
	});

	return currentLink;
}

export function getCurrentBlockType (editorState) {
	const selection = editorState.getSelection();
	const content = editorState.getCurrentContent();
	const start = selection.getStartKey();
	const end = selection.getEndKey();
	const block = content.getBlockForKey(start);

	return start === end ? block.getType() : '';
}


export function createLink (href) {
	return Entity.create(ENTITY_TYPE.LINK, 'MUTABLE', {href});
}
