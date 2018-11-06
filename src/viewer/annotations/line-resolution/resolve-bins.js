import {RETRY_AFTER_DOM_SETTLES} from '../types/Annotation';

const LINE_TOLERANCE = 30;

function getLineKey (bins, line) {
	//If we've already defined a bin for that line, just return it
	if (bins[line]) { return line; }

	const upper = Math.round(line + (LINE_TOLERANCE / 2));
	const lower = Math.round(line + (LINE_TOLERANCE / 2));

	for (let lineKey of Object.keys(bins)) {
		const potentialLine = parseInt(lineKey, 10);

		if (potentialLine >= lower && potentialLine <= upper) {
			return potentialLine;
		}
	}

	//If we can't find an existing line, return new key
	return line;
}

export default function resolveBins (items) {
	if (!items) { return {}; }

	return items.reduce(({bins, shouldRetry}, item) => {
		if (shouldRetry) { return {bins, shouldRetry}; }

		const line = item.resolveVerticalLocation();

		if (line === RETRY_AFTER_DOM_SETTLES) { return {bins, shouldRetry: true}; }

		const key = getLineKey(bins, line);

		if (key == null) { return {bins, shouldRetry}; }

		const existing = bins[key] || [];

		if (existing.includes(item)) { return {bins, shouldRetry}; }

		return {
			bins: {...bins, [key]: [...existing, item]},
			shouldRetry
		};
	}, {bins: {}, shouldRetry: false});
}
