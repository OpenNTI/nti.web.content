import React from 'react';
import {Entity} from 'draft-js';

ExternalLink.propTypes = {
	entityKey: React.PropTypes.string,
	children: React.PropTypes.any
};
export default function ExternalLink ({entityKey, children}) {
	const {url} = Entity.get(entityKey).getData();

	return (
		<a href={url} className="draft-core-external-link">
			Link
		</a>
	);
}
