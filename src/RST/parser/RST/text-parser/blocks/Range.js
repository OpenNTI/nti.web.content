import Plaintext from './Plaintext';
import Regex from '../Regex';

const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Text');

export default class Range {
	static sequence = []
	static rangeName = ''

	static getSequenceLength () {
		return this.sequence.length;
	}


	static getSequenceAsPlainText () {
		return this.sequence.reduce((acc, x) => {
			if (typeof x === 'string') {
				acc.push(x);
			}

			return acc;
		}, []).join('');
	}


	static matchesSequence (inputInterface) {
		const seq = this.sequence;

		for (let i = 0; i < seq.length; i++) {
			let seqItem = seq[i];
			let input = inputInterface.getInput(i);
			let matches = false;

			if (seqItem instanceof RegExp) {
				matches = seqItem.test(input);
			} else {
				matches = seqItem === input;
			}

			if (!matches) {
				return {matches: false, length: i};
			}
		}

		return {matches: true, length: this.getSequenceLength()};
	}


	static isNextBlock (inputInterface, context) {
		const {matches, length} = this.matchesSequence(inputInterface);

		const prevInput = inputInterface.getInput(-1);
		const nextInput = inputInterface.getInput(length);

		const isValidStart = Regex.isValidRangeStart(prevInput, nextInput);
		const isValidEnd = Regex.isValidRangeEnd(prevInput, nextInput);

		return matches && //the block matches the sequence for this range
					!context.isEscaped && //and we aren't escaped
					(!context.openRange || context.openRange === this.rangeName) && //and we aren't parsing a different range
					((!context.openRange && isValidStart) || (context.openRange === this.rangeName && isValidEnd)); //and we are either a valid start or end to our range
	}


	static parse (inputInterface, context, currentBlock) {
		const length = this.getSequenceLength();
		const openedRange = !context.openRange;
		const newContext = {...context, isEscaped: false, openRange: this.rangeName};

		//Ranges have to have at least one character between the start and end
		//so go ahead and consume it here.
		const char = inputInterface.getInput(length);
		const block = new this(openedRange && char);

		return {
			block: this.afterParse(block, inputInterface, context, currentBlock),
			context: newContext,
			length: openedRange ? length + 1 : length
		};
	}


	static afterParse (block/*, inputInterface, context, currentBlock*/) {
		return block;
	}


	constructor (char) {
		this[CLOSED] = false;

		if (char) {
			this[PLAIN_TEXT] = new Plaintext(char);
		}
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

	get text () {
		return this[PLAIN_TEXT] ? this[PLAIN_TEXT].text : '';
	}

	get hasText () {
		return this[PLAIN_TEXT] && this[PLAIN_TEXT].length > 0;
	}

	get length () {
		return this[PLAIN_TEXT] ? this[PLAIN_TEXT].length : 0;
	}


	get bookendChars () {
		return this.constructor.getSequenceAsPlainText();
	}

	get isValidRange () {
		return this[PLAIN_TEXT] && this.closed;
	}


	shouldAppendBlock () {
		return !this.closed;
	}


	appendBlock (block, context) {
		if (block.isPlainText) {
			this.appendPlainText(block);
		} else if (block.rangeName === this.rangeName) {
			this.doClose(block);
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


	doClose () {
		this[CLOSED] = true;
	}


	getRanges () {
		return {};
	}


	getOutput (context) {
		if (!this.isValidRange) {
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
