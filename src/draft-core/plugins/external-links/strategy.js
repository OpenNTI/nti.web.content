import {Entity} from 'draft-js';
import {ENTITY_TYPE} from 'draft-js-utils';

export default function (contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();

			return entityKey !== null && Entity.get(entityKey).getType() === ENTITY_TYPE.LINK;
		},
		callback
	);
}
