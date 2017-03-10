import escapeRST from './escapeRST';

export default function (block) {
	return escapeRST(block.text);
}
