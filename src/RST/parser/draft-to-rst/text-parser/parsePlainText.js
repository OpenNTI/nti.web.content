import escapeRST from './escapeRST';
import trimInvalidWhitespace from './trimInvalidWhitespace';

export default function (block) {
	return trimInvalidWhitespace(escapeRST(block.text));
}
