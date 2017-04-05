import {Entity, RichUtils} from 'draft-js';

import {ENTITIES} from '../../../Constants';

function createLink (href) {
	return Entity.create(ENTITIES.LINK, 'MUTABLE', {href});
}

export default function createLinkAtSelection (link, editorState, selection) {
	return RichUtils.toggleLink(editorState, selection, createLink(link));
}
