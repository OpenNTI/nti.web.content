import {INLINE_STYLE} from 'draft-js-utils';

const STYLE = Symbol('Style');
const PLAIN_TEXT = Symbol('Text');
const OPEN_CHARS = Symbol('Open Chars');
const CLOSED_CHARS = Symbol('Closed Chars');

const RANGE_NAME = 'emphasis';

export default class Emphasis {
	static isTypeForBlock (blockInput, context) {
		return blockInput === '*' && //If its an asterisk
					!context.isEscaped && //and its not escaped
					(!context.openRange || context.openRange === RANGE_NAME); //and we aren't in the middle of parsing another range
	}

	static parse (block, context) {
		const newContext = {...context, isEscaped: false, openRange: RANGE_NAME};

		return {block: new this(block), context: newContext};
	}

	isEmphasis = true

	constructor () {
		this[STYLE] = INLINE_STYLE.ITALIC;
		this[OPEN_CHARS] = 1;
		this[CLOSED_CHARS] = 0;
	}


	get hasText () {
		return this[PLAIN_TEXT] && this[PLAIN_TEXT].length;
	}


	get length () {
		return this[PLAIN_TEXT] ? this[PLAIN_TEXT].length : 0;
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
		//If we are parsing
		if (block.isEmphasis && this.hasText) {
			this[CLOSED_CHARS] += 1;
		} else if (block.isEmphasis) {
			this.setStrongEmphasis();
		} else if (block.isPlainText) {
			if (block.isWhitespace && !this.hasText) {
				this[CLOSED_CHARS] = this[OPEN_CHARS];
			} else {
				this.addText(block);
			}
		} else {
			throw new Error('Invalid Content in Emphasis');
		}

		const newContext = {...context, openRange: this.closed ? null : RANGE_NAME};

		return {block: this, context: newContext};
	}


	addText (block) {
		if (!this[PLAIN_TEXT]) {
			this[PLAIN_TEXT] = block;
		} else {
			this[PLAIN_TEXT].appendBlock(block);
		}
	}


	getOutput (context) {
		if (!this[PLAIN_TEXT]) {
			return this.getOutputAsPlainText(context);
		}

		const range = {style: this[STYLE], offset: context.charCount, length: this.length};
		const {output, context:newContext} = this[PLAIN_TEXT].getOutput(context);

		if (!newContext.inlineStyleRanges) {
			newContext.inlineStyleRanges = [];
		}

		newContext.inlineStyleRanges.push(range);

		return {output, context: newContext};
	}


	getOutputAsPlainText (context) {
		const text = this[OPEN_CHARS] === 2 ? '** ' : '* ';
		const newContext = {...context, charCount: context.charCount + text.length};

		return {output: text, context: newContext};
	}
}
