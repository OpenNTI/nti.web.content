import {Entity} from 'draft-js';

import {ENTITIES, MUTABILITY} from '../../../Constants';

export default function createLink (href) {
	return Entity.create(ENTITIES.LINK, MUTABILITY.MUTABLE, {href});
}
