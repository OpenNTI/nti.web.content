function sortRanges (ranges) {
	return ranges.sort((a, b) => {
		return a.offset < b.offset ? -1 : a.offset === b.offset ? 0 : 1;
	});
}

function createNormalizedRange (styles, keys, offset, length) {
	let styleList = styles.filter(x => x);
	//draft numbers the keys so the first one is going to be 0
	let keyList = keys.filter(x => x || x === 0);

	return {
		styles: styleList,
		keys: keyList,
		offset,
		length
	};
}

function getEnd (range) {
	return range.offset + range.length;
}

function getOverlapRange (normalizedStart, endRange) {
	const length = getEnd(normalizedStart) - endRange.offset;
	const offset = endRange.offset;
	const styles = [endRange.style, ...normalizedStart.styles];
	const keys = [endRange.key, ...normalizedStart.keys];

	return createNormalizedRange(styles, keys, offset, length);
}

function pushStyleToRange (range, style) {
	if (style) {
		range.styles.push(style);
	}
}

function pushKeyToRange (range, key) {
	//draft numbers the keys so the first one is going to be 0
	if (key || key === 0) {
		range.styles.push(key);
	}
}


export default function normalizeRanges (ranges) {
	const sorted = sortRanges(ranges);
	let normalizedRanges = [];
	let currentRange = null;

	for (let range of sorted) {
		let {offset, length, style, key} = range;

		if (!currentRange || getEnd(currentRange) < offset) {
			currentRange = createNormalizedRange([style], [key], offset, length);
			normalizedRanges.push(currentRange);
		} else if (currentRange.offset === offset && currentRange.length === length) {
			pushStyleToRange(currentRange, style);
			pushKeyToRange(currentRange, key);
		} else {
			let overlapRange = getOverlapRange(currentRange, range);

			//shorten the current range
			currentRange.length = overlapRange.offset - currentRange.offset;

			//add the overlap range
			normalizedRanges.push(overlapRange);

			//add the rest of the range
			currentRange = createNormalizedRange([style], [key], getEnd(overlapRange), getEnd(range) - getEnd(overlapRange));

			normalizedRanges.push(currentRange);
		}
	}

	return normalizedRanges;
}
