import byPoint from './range-for-line-by-point';
import byPointIE from './range-for-line-by-point-ie';
import bySelection from './range-for-line-by-selection';

const PREFERENCE = [
	byPoint,
	byPointIE,
	bySelection
];

export function getRange (y, container) {
	for (let strategy of PREFERENCE) {
		if (strategy.shouldUse(y, container)) {
			return strategy.computeRange(y, container);
		}
	}

	return null;
}
