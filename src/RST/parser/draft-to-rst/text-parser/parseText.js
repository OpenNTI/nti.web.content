import normalizeRanges from './normalizeRanges';
import escapeRST from './escapeRST';
import parseRange from './parseRange';
import trimInvalidWhitespace from './trimInvalidWhitespace';

function isConsecutive (prevRange, range) {
	return prevRange && prevRange.offset + prevRange.length === range.offset;
}


export default function (block, context) {
	const {inlineStyleRanges, entityRanges, text} = block;
	const normalizedRanges = normalizeRanges(inlineStyleRanges.concat(entityRanges), text.length);

	let i = 0;
	let parsedText = '';

	for (let j = 0; j < normalizedRanges.length; j++) {
		let range = normalizedRanges[j];
		let prevRange = normalizedRanges[j - 1];

		let {offset, length} = range;

		if (offset !== i) {
			parsedText += escapeRST(text.substr(i, offset - i));
		}

		prevRange = isConsecutive(prevRange, range) ? prevRange : null;

		parsedText += parseRange(range, escapeRST(text.substr(offset, length)), context, prevRange);
		i = offset + length;
	}

	parsedText += escapeRST(text.substr(i, text.length - i));

	return trimInvalidWhitespace(parsedText);
}
