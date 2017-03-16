import escapeRST from './escapeRST';
import trimInvalidWhitespace from './trimInvalidWhitespace';

export default function parseSingleLinePlainText (block) {
	const text = block.text;

	return trimInvalidWhitespace(escapeRST(text.replace(/\n/g, ' ')));
}
