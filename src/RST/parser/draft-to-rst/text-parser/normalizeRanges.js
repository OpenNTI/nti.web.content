function getRangesBoundaries (ranges) {
	const sorted = ranges.sort((a, b) => {
		const lengthSort = a.length < b.length ? -1 : a.length === b.length ? 0 : 1;

		return a.offset < b.offset ? -1 : a.offset === b.offset ? lengthSort : 1;
	});

	return {
		start: sorted[0].offset,
		end: sorted[sorted.length - 1].offset + sorted[sorted.length - 1].length
	};
}

function pushStyleToRange (range, style) {
	if (style) {
		range.styles.push(style);
	}
}

function pushKeyToRange (range, key) {
	//draft numbers the keys so the first one is going to be 0
	if (key || key === 0) {
		range.keys.push(key);
	}
}

function expandRanges (ranges) {
	const rangeAtCharMap = {};

	for (let range of ranges) {
		let {offset, length, style, key} = range;

		for (let i = 0; i < length; i++) {
			let charIndex = offset + i;

			if (!rangeAtCharMap[charIndex]) {
				rangeAtCharMap[charIndex] = {styles: [], keys: []};
			}

			pushStyleToRange(rangeAtCharMap[charIndex], style);
			pushKeyToRange(rangeAtCharMap[charIndex], key);
		}
	}

	return rangeAtCharMap;
}

function createMap (values) {
	return values.reduce((acc, value) => {
		acc[value] = true;

		return acc;
	}, {});
}


function buildNormalizedRange (offset, styles, keys) {
	return {
		length: 1,
		offset,
		styles,
		keys,
		styleMap: createMap(styles),
		keyMap: createMap(keys)
	};
}

function normalizedRangesAreSame (a, b) {
	if (a.styles.length !== b.styles.length || a.keys.length !== b.keys.length) {
		return false;
	}

	const {styleMap, keyMap} = a;
	const {styles, keys} = b;

	for (let style of styles) {
		if (!styleMap[style]) {
			return false;
		}
	}

	for (let key of keys) {
		if (!keyMap[key]) {
			return false;
		}
	}

	return true;
}

export default function normalizeRanges (ranges) {
	if (!ranges.length) { return []; }

	const {start, end} = getRangesBoundaries(ranges);
	const expandedRanges = expandRanges(ranges);
	let normalizedRanges = [];
	let currentRange = null;

	for (let i = start; i < end; i++) {
		if (!expandedRanges[i]) {
			currentRange = null;
			continue;
		}

		let {styles, keys} = expandedRanges[i];
		let rangeForChar = buildNormalizedRange(i, styles, keys);

		if (currentRange && normalizedRangesAreSame(currentRange, rangeForChar)) {
			currentRange.length += 1;
		} else {
			currentRange = rangeForChar;
			normalizedRanges.push(currentRange);
		}
	}

	return normalizedRanges;
}


// export default function normalizeRanges (ranges, length) {
// 	const rangeMap = createRangeMap(ranges);
// 	let normalizedRanges = [];
// 	let currentRange = null;

// 	for (let range of sorted) {
// 		let {offset, length, style, key} = range;

// 		if (!currentRange || getEnd(currentRange) < offset) {
// 			currentRange = createNormalizedRange([style], [key], offset, length);
// 			normalizedRanges.push(currentRange);
// 		} else if (currentRange.offset === offset && currentRange.length === length) {
// 			pushStyleToRange(currentRange, style);
// 			pushKeyToRange(currentRange, key);
// 		} else {
// 			let overlapRange = getOverlapRange(currentRange, range);

// 			//shorten the current range
// 			currentRange.length = overlapRange.offset - currentRange.offset;

// 			//add the overlap range
// 			normalizedRanges.push(overlapRange);

// 			//add the rest of the range
// 			currentRange = createNormalizedRange(overlapRange.styles, overlapRange.keys, getEnd(overlapRange), getEnd(range) - getEnd(overlapRange));

// 			normalizedRanges.push(currentRange);
// 		}
// 	}

// 	return normalizedRanges;
// }
