import escapeRST from './escapeRST';
import trimInvalidWhitespace from './trimInvalidWhitespace';

export default function parseSingleLinePlainText (block, doNotEscape) {
	const text = block.text;
	const esc = doNotEscape ? x => x : escapeRST;

	return trimInvalidWhitespace(esc(text.replace(/\n/g, ' ')));
}
