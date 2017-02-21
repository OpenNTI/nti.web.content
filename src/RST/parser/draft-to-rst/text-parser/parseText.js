import normalizeRanges from './normalizeRanges';
import parseRange from './parseRange';

export default function (block, context) {
	const {inlineStyleRanges, entityRanges, text} = block;
	const normalizedRanges = normalizeRanges(inlineStyleRanges.concat(entityRanges));

	let i = 0;
	let parsedText = '';

	for (let range of normalizedRanges) {
		let {offset, length} = range;

		if (offset !== i) {
			parsedText += text.substr(i, offset - i);
		}

		parsedText += parseRange(range, text.substr(offset, length), context);
		i = offset + length;
	}

	parsedText += text.substr(i, text.length - i);

	return parsedText;
}