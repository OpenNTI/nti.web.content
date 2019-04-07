import Anchor from '../Anchor';

import getAnchorInfo from './get-anchor-info';

const FULL = 'full';
const PARTIAL = 'partial';
const NONE = 'none';

function rectCovers (rect, clientY) {
	const top = rect.top;
	const bottom = rect.top + rect.height;

	return top <= clientY && bottom >= clientY;
}

function rectDistance (rect, clientY) {
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

function getAnchorCoverage (anchor, clientY) {
	const rects = Array.from(anchor.getClientRects()).filter(rect => rect.height);

	const {covering, distance} = rects.reduce((acc, rect) => {
		const covers = rectCovers(rect, clientY);
		const dist = rectDistance(rect, clientY);

		return {
			covering: covers ? acc.covering + 1 : acc.covering,
			distance: Math.min(acc.distance, dist)
		};
	}, {covering: 0, distance: Infinity});

	return {
		coverage: covering === rects.length ? FULL : (covering > 0 ? PARTIAL : NONE),
		distance
	};
}

function getClosest (anchors) {
	const sorted = anchors.sort(({distance: a}, {distance: b}) => a - b);
	const distance = anchors[0].distance;

	let options = [];

	for (let anchor of sorted) {
		if (anchor.distance === distance) { options.push(anchor); }
	}

	return options[options.length - 1];
}

export default function getAnchorInfoForClientY (clientY, content, container) {
	const anchors = Anchor.getAllAnchors(content);

	const options = [];
	let lastDistance = -1;

	for (let anchor of anchors) {
		const {coverage, distance} = getAnchorCoverage(anchor, clientY);
		const leaving = distance > lastDistance;

		lastDistance = distance;

		//If we find one that fully covers the clientY, just return it
		if (coverage === FULL) { return getAnchorInfo(anchor, container); }

		if (coverage === PARTIAL) {
			options.push({
				distance,
				anchor
			});
		} else if (leaving) {
			options.push({
				distance,
				anchor
			});
		}
	}

	const closest = getClosest(options);

	return closest && getAnchorInfo(closest.anchor, container);
}
