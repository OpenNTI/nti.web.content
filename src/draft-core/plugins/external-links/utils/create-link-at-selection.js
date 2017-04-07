import {Entity, RichUtils} from 'draft-js';

import {ENTITIES} from '../../../Constants';

import replaceEntityTextAtSelection from './replace-entity-text-at-selection';

function createLink (href) {
	return Entity.create(ENTITIES.LINK, 'MUTABLE', {href});
}

export default function createLinkAtSelection (link, text, editorState, selection) {
	const entity = createLink(link);
	const newState = RichUtils.toggleLink(editorState, selection, entity);

	if (!text) {
		return newState;
	}

	return replaceEntityTextAtSelection(text, entity, selection, editorState);
}
