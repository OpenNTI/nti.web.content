import {INLINE_STYLE} from 'draft-js-utils';

const STYLE = Symbol('Style');
const TEXT = Symbol('Text');
const OPEN_CHARS = Symbol('Open Chars');
const CLOSED_CHARS = Symbol('Closed Chars');
const HAS_TEXT = Symbol('Has Text');

export default class Emphasis {
	static isTypeForBlock (block, context) {
		return block === '*' && !context.isEscaped;
	}

	static parse (block, context) {
		const newContext = {...context, isEscaped: false};

		return {block: new this(block), context: newContext};
	}

	isEmphasis = true

	constructor () {
		this[TEXT] = '';
		this[STYLE] = INLINE_STYLE.ITALIC;
		this[OPEN_CHARS] = 1;
		this[CLOSED_CHARS] = 0;
	}


	get text () {
		return this[TEXT];
	}


	get length () {
		return this.text.length;
	}


	get closed () {
		return this[OPEN_CHARS] === this[CLOSED_CHARS];
	}


	setStrongEmphasis () {
		this[STYLE] = INLINE_STYLE.BOLD;
		this[OPEN_CHARS] = 2;
	}


	shouldAppendBlock () {
		return !this.closed;
	}


	appendBlock (block, context) {
		if (block.isEmphasis && this[HAS_TEXT]) {
			this[CLOSED_CHARS] += 1;
		} else if (block.isEmphasis) {
			this.setStrongEmphasis();
		} else if (block.isPlainText) {
			this[HAS_TEXT] = true;
			this[TEXT] += block.text;
		} else {
			throw new Error('Invalid Content in Emphasis');
		}

		return {block: this, context};
	}


	getOutput (context) {
		const range = {style: this[STYLE], offset: context.charCount, length: this.length};
		const newContext = {...context, charCount: context.charCount + this.length};

		if (!context.inlineStyleRanges) {
			context.inlineStyleRanges = [];
		}

		context.inlineStyleRanges.push(range);

		return {output: this.text, context: newContext};
	}
}
