import normalizeRanges from './normalizeRanges';
import escapeRST from './escapeRST';
import parseRange from './parseRange';
import trimInvalidWhitespace from './trimInvalidWhitespace';


export default function (block, context) {
	const {inlineStyleRanges, entityRanges, text} = block;
	const normalizedRanges = normalizeRanges(inlineStyleRanges.concat(entityRanges), text.length);

	let i = 0;
	let parsedText = '';

	for (let range of normalizedRanges) {
		let {offset, length} = range;

		if (offset !== i) {
			parsedText += escapeRST(text.substr(i, offset - i));
		}

		parsedText += parseRange(range, escapeRST(text.substr(offset, length)), context);
		i = offset + length;
	}

	parsedText += escapeRST(text.substr(i, text.length - i));

	return trimInvalidWhitespace(parsedText);
}
