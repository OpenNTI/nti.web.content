import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';


export default class StrongEmphasis extends Range {
	static rangeName = 'strong-emphasis'
	static openChars = '**'
	static closeChars = '**'

	static matchOpen (inputInterface) {
		const input = inputInterface.get(0);
		const nextInput = inputInterface.get(1);

		return {matches: input === '*' && nextInput === '*', nextChar: inputInterface.get(2)};
	}


	getRanges (context) {
		const range = {style: INLINE_STYLE.BOLD, offset:context.charCount, length: this.length};

		return {
			inlineStyleRanges: [range]
		};
	}
}
