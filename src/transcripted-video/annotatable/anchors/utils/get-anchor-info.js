import Anchor from '../Anchor';
import TimeAnchor from '../TimeAnchor';

const TYPES = [TimeAnchor, Anchor];

export default function getAnchorInfo(anchor, container) {
	const containerRect = container.getBoundingClientRect();

	for (let t of TYPES) {
		const info = t.getAnchorInfo(anchor);
		const anchorRect = anchor.getBoundingClientRect();

		if (info) {
			return {
				info,
				node: anchor,
				top: anchorRect.top - containerRect.top,
				left: anchorRect.left - containerRect.left,
				height: anchorRect.height,
			};
		}
	}
}
