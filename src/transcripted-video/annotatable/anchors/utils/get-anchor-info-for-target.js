import Anchor from '../Anchor';

import getAnchorInfo from './get-anchor-info';

export default function getAnchorInforForTarget(target, content, container) {
	const node = Anchor.getAnchorAround(target);

	return node ? getAnchorInfo(node, container) : null;
}
