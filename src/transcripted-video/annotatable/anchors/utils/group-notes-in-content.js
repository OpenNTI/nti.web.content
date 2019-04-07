import Anchor from '../Anchor';
import TimeAnchor from '../TimeAnchor';

const TYPES = [
	TimeAnchor,
	Anchor
];

function getAnchorInfo (anchors, container) {
	const containerRect = container.getBoundingClientRect();

	return anchors.map((anchor) => {
		for (let t of TYPES) {
			const info = t.getAnchorInfo(anchor);
			const anchorRect = anchor.getBoundingClientRect();

			if (info) {
				return {
					info,
					top: anchorRect.top - containerRect.top
				};
			}
		}
	});
}

function findAnchorByRange (anchors, range) {
	//For now just handle time ranges
	if (!range.isTimeRange) { return null; }

	const rangeStart = range.start.seconds;
	const rangeEnd = range.end.seconds;

	return anchors.find((anchor) => {
		const {info} = anchor;

		if (!info.isTimeAnchor) { return false; }

		const {startTime, endTime} = info;

		if (!rangeEnd) {
			return rangeStart >= startTime && rangeStart <= endTime;
		}

		return rangeStart.isFloatLessThanOrEqual(startTime) && rangeEnd.isFloatGreaterThanOrEqual(endTime);
	});
}

function findAnchorById (anchors, id) {
	return anchors.find((anchor) => {
		const {info} = anchor;

		return info && info.id === id;
	});
}

function sortGroups ({top: topA}, {top: topB}) {
	return topA - topB;
}


export default function groupNotesInContent (content, container, notes) {
	const anchors = getAnchorInfo(Anchor.getAllAnchors(content), container);

	const groups = notes.reduce((acc, note) => {
		const {applicableRange:range, ContainerId} = note;

		const anchor = (range && findAnchorByRange(anchors, range)) || findAnchorById(anchors, ContainerId);

		//TODO: figure out what, if anything we need to do here
		if (!anchor) { return acc; }

		const {top} = anchor;
		const key = `${top}px`;

		acc[key] = acc[key] || {notes: [], top};
		acc[key].notes.push(note);

		return acc;
	}, {});

	return Object.values(groups).sort(sortGroups);
}
