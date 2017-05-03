import {Modifier, BlockMapBuilder, ContentBlock, genKey, EditorState} from 'draft-js';
//We don't really need immutable its just something draft needs so let draft depend on it
import {List} from 'immutable';//eslint-disable-line import/no-extraneous-dependencies

import {BLOCKS, CHANGE_TYPES} from '../../../Constants';

import fixSelection from './fix-selection';
import removeContent from './remove-content';

//Modified from the atomic block utils: https://github.com/facebook/draft-js/blob/213cd764f61cc64552bddd672ae1748529d55333/src/model/modifier/AtomicBlockUtils.js

function fixContentAndSelection (content, selection, replace) {
	const willRemove = replace && !selection.isCollapsed();
	const fixedContent = willRemove ? removeContent(content, selection) : content;
	const fixedSelection = willRemove ? fixedContent.getSelectionAfter() : fixSelection(content, selection, willRemove);

	return {fixedContent, fixedSelection};
}

function splitContentAndGetSelection (content, selection) {
	const splitContent = Modifier.splitBlock(content, selection);

	return {
		splitContent,
		insertionSelection: splitContent.getSelectionAfter()
	};
}


export default function insertBlock (block, replace, editorState) {
	const currentContent = editorState.getCurrentContent();
	const currentSelection = editorState.getSelection();

	//TODO, when replacing look into pulling entity and style range info into the new blocks character data
	const {fixedContent, fixedSelection} = fixContentAndSelection(currentContent, currentSelection, replace);
	const {splitContent, insertionSelection} = splitContentAndGetSelection(fixedContent, fixedSelection);

	const asType = Modifier.setBlockType(splitContent, insertionSelection, block.type);

	const fragment = BlockMapBuilder.createFromArray([
		new ContentBlock({
			key: genKey(),
			type: block.type,
			text: block.text,
			data: block.data,
			characterList: List()
		}),
		new ContentBlock({
			key: genKey(),
			type: BLOCKS.UNSTYLED,
			text: '',
			characterList: List()
		})
	]);

	const withBlock = Modifier.replaceWithFragment(asType, insertionSelection, fragment);

	const newContent = withBlock.merge({
		selectionBefore: currentSelection,
		selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true)
	});

	return EditorState.push(editorState, newContent, CHANGE_TYPES.INSERT_FRAGMENT);
}
