const WHITE_SPACE = /\s/;
const TAB_REGEX = /\t/;

/**
 * Return the offsets of the start of the block and the start of the text.
 *
 * return {
 * 	blockOffset: the offset to the start of the block
 * 	lineOffet: the offset to the start of the text
 * }
 *
 * Treat tabs or two spaces as being block offsets, and count them as block offsets and line offsets.
 * As soon as you hit the block indicator, or a character that isn't a tab or a space
 * followed by another space, stop adding white space to the block offset and only add it
 * to the line offset until you hit a  non-whitespace character.
 *
 * @param  {String} block          the blocks to get the offsets of
 * @param  {String} blockIndicator the text that indicates the block and should not be counted
 * @param  {Number} baseDepth      the amount to take off
 * @return {Object}                the offsets of the block.
 */
export function getIndention (block, blockIndicator, baseDepth = 0) {
	const blockStart = blockIndicator ? block.indexOf(blockIndicator) : -1;
	const end = block.length;
	let index = 0;
	let blockStarted = false;
	let blockOffset = 0;
	let	lineOffset = 0;

	while (index < end) {
		//If we hit the blockIndicator stop counting for the blockOffset
		//and only count the rest for the lineOffset
		if (index === blockStart) {
			blockStarted = true;
			lineOffset += blockIndicator.length;
			index +=  blockIndicator.length;
			continue;
		}

		let char = block.charAt(index);

		//If we've started on the block
		if (blockStarted) {
			//If we are hitting whitespace
			//increase the line offset and continue
			if (WHITE_SPACE.test(char)) {
				lineOffset += 1;
				index += 1;
			//If we hit something other than whitespace we're done getting
			//the offsets
			} else {
				break;
			}
		} else {
			//If its a tab increase the blockOffset and lineOffset
			if (TAB_REGEX.test(char)) {
				blockOffset += 1;
				lineOffset += 1;
				index += 1;
			//If its a space followed by another space increase the blockOffset
			//and the lineOffset
			} else if (char === ' ' && block.charAt(index + 1) === ' ') {
				blockOffset += 1;
				lineOffset += 2;
				index += 2;
			//If its just whitespace (not two spaces) stop counting the blockOffset
			//add the remaining white space to the lineOffset
			} else if (WHITE_SPACE.test(char)) {
				lineOffset += 1;
				blockStarted = true;
				index += 1;
			//If its not whitespace we are done parsing the offsets
			} else {
				break;
			}
		}
	}

	blockOffset -= baseDepth;
	lineOffset -= baseDepth;

	return {blockOffset, lineOffset};
}


export function getKeyForEntityText (text) {
	return text.replace(WHITE_SPACE, ' ').toLowerCase();
}
