import Anchor from '../Anchor';

import getAnchorInfo from './get-anchor-info';

const FULL = 'full';
const PARTIAL = 'partial';
const NONE = 'none';

function rectCovers(rect, clientY) {
	const top = rect.top;
	const bottom = rect.top + rect.height;

	return top <= clientY && bottom >= clientY;
}

function rectYDistance(rect, clientY) {
	const top = rect.top;
	const bottom = rect.top + rect.height;

	let distance = 0;

	if (clientY < top) {
		distance = top - clientY;
	} else if (clientY > bottom) {
		distance = clientY - bottom;
	}

	return distance;
}

function getAnchorCoverage(anchor, clientX, clientY) {
	const rects = Array.from(anchor.getClientRects()).filter(
		rect => rect.height
	);
	const coveringRect = rects.filter(rect => rectCovers(rect, clientY))[0];
	const distance = coveringRect
		? 0
		: Math.min(...rects.map(rect => rectYDistance(rect, clientY)));

	return {
		coverage: coveringRect ? (rects.length === 1 ? FULL : PARTIAL) : NONE,
		distance,
	};
}

function getClosest(anchors) {
	const sorted = anchors.sort(({ distance: a }, { distance: b }) => a - b);
	const distance = anchors[0] && anchors[0].distance;

	let options = [];

	for (let anchor of sorted) {
		if (anchor.distance === distance) {
			options.push(anchor);
		}
	}

	return options[options.length - 1];
}

export default function getAnchorInfoForClientY(
	clientX,
	clientY,
	content,
	container
) {
	const anchors = Anchor.getAllAnchors(content);

	const partial = [];
	const none = [];

	for (let anchor of anchors) {
		const { coverage, distance } = getAnchorCoverage(
			anchor,
			clientX,
			clientY
		);

		//If we find one that fully covers the clientY, just return it
		if (coverage === FULL) {
			return getAnchorInfo(anchor, container);
		}

		if (coverage === PARTIAL) {
			partial.push({
				distance,
				anchor,
			});
		} else {
			none.push({
				distance,
				anchor,
			});
		}
	}

	const closest = getClosest(partial) || getClosest(none);

	return closest && getAnchorInfo(closest.anchor, container);
}
