import TextParser from '../text-parser';

const TEXT = Symbol('Text');

export default class Text {
	constructor (text = '') {
		this[TEXT] = text;
	}


	get text () {
		return this[TEXT];
	}


	append (textBlock) {
		const current = this[TEXT].replace(/\s$/, '');
		const toAppend = textBlock.text.replace(/^\s/, '');

		this[TEXT] = current + ' ' + toAppend;
	}


	getOutput (context) {
		const text = this[TEXT];
		const parsed = TextParser.parse(text);

		if (parsed.entityMap) {
			context.entityMap = {...(context.entityMap || {}), ...parsed.entityMap};
			delete parsed.entityMap;
		}

		return {output: parsed, context};
	}
}
