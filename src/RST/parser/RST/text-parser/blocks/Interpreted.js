import {INLINE_STYLE} from 'draft-js-utils';

const OPEN_CHARS = Symbol('Open Chars');
const CLOSED_CHARS = Symbol('Closed Chars');
const CLOSED = Symbol('Closed');
const IS_LITERAL = Symbol('Is Literal');
const PLAIN_TEXT = Symbol('Plaintext');

const RANGE_NAME = 'Interpreted';

export default class Interpreted {
	static isTypeForBlock (block, context) {
		return block === '`' && //If its a back tick
					!context.isEscaped && //and we aren't escaped
					(!context.openRange || context.openRange === RANGE_NAME); //and we aren't parsing another range
	}

	static parse (block, context) {
		const newContext = {...context, isEscaped: false, openRange: RANGE_NAME};

		return {block: new this(block), context: newContext};
	}

	isInterpreted = true

	constructor () {
		this[IS_LITERAL] = false;
		this[OPEN_CHARS] = 1;
		this[CLOSED_CHARS] = 0;
	}


	get hasText () {
		return this[PLAIN_TEXT] && this[PLAIN_TEXT].length > 0;
	}


	get closed () {
		return this[OPEN_CHARS] === this[CLOSED_CHARS];
	}


	get length () {
		return this[PLAIN_TEXT] ? this[PLAIN_TEXT].length : 0;
	}


	setLiteral () {
		this[IS_LITERAL] = true;
		this[OPEN_CHARS] = 2;
	}


	shouldAppendBlock () {
		return !this.closed;
	}


	appendBlock (block, context) {
		if (block.isPlainText) {
			if (block.isWhitespace && !this.hasText) {
				this[CLOSED] = true;
			} else {
				this.addText(block);
			}
		} else if (block.isInterpreted && this.hasText) {
			this[CLOSED_CHARS] += 1;
		} else if (block.isInterpreted) {
			this.setLiteral();
		}

		const newContext = {...context, openRanges: this.closed ? null : RANGE_NAME};

		return {block: this, context: newContext};
	}


	addText (block) {
		if (!this[PLAIN_TEXT]) {
			this[PLAIN_TEXT] = block;
		} else {
			this[PLAIN_TEXT].appendBlock(block);
		}
	}


	getStyle () {
		let style;

		if (this[IS_LITERAL]) {
			style = INLINE_STYLE.CODE;
		}

		return style;
	}


	getOutput (context) {
		if (!this[PLAIN_TEXT]) {
			return this.getOutputAsPlaintext(context);
		}

		const style = this.getStyle();
		const range = style && {style: this.getStyle(), offset: context.charCount, length: this.length};
		const {output, context:newContext} = this[PLAIN_TEXT].getOutput(context);

		if (range) {
			if (!newContext.inlineStyleRanges) {
				newContext.inlineStyleRanges = [];
			}

			newContext.inlineStyleRanges.push(range);
		}

		return {output, context: newContext};
	}


	getOutputAsPlaintext (context) {
		const text = this[OPEN_CHARS] === 2 ? '`` ' : '` ';
		const newContext = {...context, charCount: context.charCount + text.length};

		return {output: text, context: newContext};
	}
}
