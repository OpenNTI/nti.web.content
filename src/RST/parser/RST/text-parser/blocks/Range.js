import Plaintext from './Plaintext';

const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Text');

export default class Range {
	static sequence = []
	static rangeName = ''

	static isTypeForBlock (blockInput, context, currentBlock, nextInput, prevInput) {
		const {sequence:seq} = this;
		const matchesSequence = blockInput === seq[0] && (seq.length < 2 || nextInput === seq[1]);
		const potentiallyClosingRange = context.openRange === this.rangeName && prevInput !== ' ';

		return matchesSequence && //the block matches the sequence for this range
					!context.isEscaped && //and we aren't escaped
					(!context.openRange || potentiallyClosingRange); //and we aren't in the middle of parsing another range
	}


	static parse (block, context) {
		const newContext = {...context, isEscaped: false, openRange: this.rangeName};

		return {block: new this(), context: newContext, skipNextInput: this.sequence.length > 1};
	}


	constructor () {
		this[CLOSED] = false;
	}

	get sequence () {
		return this.constructor.sequence;
	}

	get rangeName () {
		return this.constructor.rangeName;
	}

	get closed () {
		return this[CLOSED];
	}

	get hasText () {
		return this[PLAIN_TEXT] && this[PLAIN_TEXT].length > 0;
	}

	get length () {
		return this[PLAIN_TEXT] ? this[PLAIN_TEXT].length : 0;
	}


	get bookendChars () {
		return this.sequence.join('');
	}


	shouldAppendBlock (block) {
		//if we aren't closed and we aren't processing white space right after opening the range
		return !this.closed && (!block.isPlainText || !block.isWhitespace || this.hasText);
	}


	appendBlock (block, context) {
		debugger;
		if (block.isPlainText) {
			this.appendPlainText(block);
		} else if (block.rangeName === this.rangeName) {
			this.maybeClose(block);
		}

		const newContext = {...context, openRange: this.closed ? null : this.rangeName};

		return {block: this, context: newContext};
	}


	appendPlainText (block) {
		if (this[PLAIN_TEXT]) {
			this[PLAIN_TEXT].appendBlock(block);
		} else {
			this[PLAIN_TEXT] = block;
		}
	}


	maybeClose (block) {
		if (this[PLAIN_TEXT] && this[PLAIN_TEXT].endsInWhitespace) {
			this[PLAIN_TEXT].appendText(block.bookendChars);
		} else if (!this[PLAIN_TEXT]) {
			this[PLAIN_TEXT] = new Plaintext(block.bookendChars);
		} else {
			this[CLOSED] = true;
		}
	}


	getRanges () {
		return {};
	}


	getOutput (context) {
		if (!this[PLAIN_TEXT] || !this.closed) {
			return this.getPlaintextOutput(context);
		}

		const {inlineStyleRanges, entityRanges, entityMap} = this.getRanges(context);
		const {output, context:newContext} = this[PLAIN_TEXT].getOutput(context);

		if (inlineStyleRanges) {
			newContext.inlineStyleRanges = (newContext.inlineStyleRanges || []).concat(inlineStyleRanges);
		}

		if (entityRanges) {
			newContext.entityRanges = (newContext.entityRanges || []).concat(entityRanges);
		}

		if (entityMap) {
			newContext.entityMap = {...(newContext.entityMap || {}), ...entityMap};
		}

		return {output, context:newContext};
	}


	getPlaintextOutput (context) {
		const plainText = new Plaintext(this.bookendChars);

		if (this[PLAIN_TEXT]) {
			plainText.appendBlock(this[PLAIN_TEXT]);
		}

		if (this.closed) {
			plainText.appendText(this.bookendChars);
		}

		return plainText.getOutput(context);
	}
}
