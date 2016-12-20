import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

export default class Literal extends Range {
	static sequence = ['`', '`']
	static rangeName = 'literal'

	getRanges (context) {
		const range = {style: INLINE_STYLE.CODE, offset:context.charCount, length: this.length};

		return {
			inlineStyleRanges: [range]
		};
	}
}
