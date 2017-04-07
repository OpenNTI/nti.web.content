import {Entity} from 'draft-js';

import {ENTITIES} from '../../../Constants';

export default function createLink (href) {
	return Entity.create(ENTITIES.LINK, 'MUTABLE', {href});
}
