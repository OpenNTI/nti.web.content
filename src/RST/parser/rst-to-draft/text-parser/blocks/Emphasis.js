import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

/*
	There is an edge case with strong emphasis and emphasis where
	the docutils parser is greedily looking at the characters and
	we aren't (we close the range as soon as possible).

	So for example ***bold***:
	Docutils would parse that as <b>*bold*</b>
	Our parser would parse that as <b>*bold</b>*
 */

export default class Emphasis extends Range {
	static rangeName = 'emphasis'
	static openChars = '*'
	static closeChars = '*'

	static matchOpen (inputInterface) {
		const input = inputInterface.getInput(0);
		const nextInput = inputInterface.getInput(1);

		return {matches: input === '*' && nextInput !== '*'};
	}

	getRanges (context) {
		const range = {style: INLINE_STYLE.ITALIC, offset:context.charCount, length: this.length};

		return {
			inlineStyleRanges: [range]
		};
	}
}

