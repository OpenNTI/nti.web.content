import Plaintext from './Plaintext';
import Regex from '../Regex';

const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Text');

export default class Range {
	static sequence = []
	static rangeName = ''


	static isNextBlock (inputInterface, context) {
		debugger;
		const {sequence:seq} = this;
		const matchesSequence = seq[0] === inputInterface.getInput() && (seq.length < 2 || inputInterface.getInput(1) === seq[1]);

		const prevInput = inputInterface.getInput(-1);
		const nextInput = inputInterface.getInput(seq.length);

		const isValidStart = Regex.isValidRangeStart(prevInput, nextInput);
		const isValidEnd = Regex.isValidRangeEnd(prevInput, nextInput);

		return matchesSequence && //the block matches the sequence for this range
					!context.isEscaped && //and we aren't escaped
					(!context.openRange || context.openRange === this.rangeName) && //and we aren't parsing a different range
					((!context.openRange && isValidStart) || (context.openRange === this.rangeName && isValidEnd)); //and we are either a valid start or end to our range
	}


	static parse (inputInterface, context) {
		const newContext = {...context, isEscaped: false, openRange: this.rangeName};

		return {block: new this(), context: newContext, length: this.sequence.length};
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
		return !this.closed && (!block.isPlainText || !block.isWhitespace || this.hasText);
	}


	appendBlock (block, context) {
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
