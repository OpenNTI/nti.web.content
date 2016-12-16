import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';


export default class StrongEmphasis extends Range {
	static sequence = ['*', '*']
	static rangeName = 'strong-emphasis'

	getRanges (context) {
		const range = {style: INLINE_STYLE.BOLD, offset:context.charCount, length: this.length};

		return {
			inlineStyleRanges: [range]
		};
	}
}
