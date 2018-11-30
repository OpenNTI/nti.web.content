import isSelectionBackwards from './is-selection-backwards';

/**
 * Taken partially from nti.web.app/src/main/js/legacy/util/Anchors#snapSelectionToWord
 * but modified since we don't want to include some of the dependencies the web app was using.
 *
 * TODO: figure out if this is good enough
 *
 * http://stackoverflow.com/questions/10964016/how-do-i-extend-selection-to-word-boundary-using-javascript-once-only/10964743#10964743
 *
 * @param {Object} selection the selection to modify
 * @return {Object} the modified selection
 */
export default function snapSelectionToWord (selection) {
	if (!selection.modify) { return selection; }

	const backwards = isSelectionBackwards(selection);

	const endNode = selection.focusNode;
	const endOffset = selection.focusOffset;

	selection.collapse(selection.anchorNode, selection.anchorOffset);

	const directions = {
		char: {
			move: backwards ? 'backward' : 'forward',
			extend: backwards ? 'forward' : 'backward'
		},
		word: {
			move: backwards ? 'forward' : 'backward',
			extend: backwards ? 'backward' : 'forward'
		}
	};

	selection.modify('move', directions.char.move, 'character');
	selection.modify('move', directions.word.move, 'word');

	selection.extend(endNode, endOffset);

	selection.modify('extend', directions.char.extend, 'character');
	selection.modify('extend', directions.word.extend, 'word');

	return selection;
}
