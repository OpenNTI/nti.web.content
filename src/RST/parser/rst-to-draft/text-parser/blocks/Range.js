import Plaintext from './Plaintext';
import Regex from '../Regex';

const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Text');


export default class Range {
	static rangeName = ''
	static openChars = ''
	static closeChars = ''

	static matchOpen () {
		return {matches: true, nextChar: '', prevChar: ''};
	}

	static matchClose (...args) {
		return this.matchOpen(...args); //By default assume the ranges are symmetrical
	}

	static isNextBlock (inputInterface, context, currentBlock) {
		const maybeOpening = !context.openRange;
		const maybeClosing = context.openRange === this.rangeName;

		const  {matches, nextChar, prevChar} = maybeOpening ?
										this.matchOpen(inputInterface, context, currentBlock) :
										this.matchClose(inputInterface, context, currentBlock);

		const prevInput = prevChar || inputInterface.getInput(-1);
		const nextInput = nextChar || inputInterface.getInput(length);

		const isValidStart = Regex.isValidRangeStart(prevInput, nextInput);
		const isValidEnd = Regex.isValidRangeEnd(prevInput, nextInput);

		return matches && //the block is either a valid ope or close for this range
				(maybeOpening || maybeClosing) && //and we are opening or closing this range (not parsing another one)
				((maybeOpening && isValidStart) || (maybeClosing && isValidEnd)); //and we are a valid start or end to our range
	}


	static parse (inputInterface, context, currentBlock) {
		const openedRange = !context.openRange;
		const length = openedRange ? this.openChars.length : this.closeChars.length;
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


	get openChars () {
		return this.constructor.openChars;
	}

	get closeChars () {
		return this.constructor.closeChars;
	}

	get isValidRange () {
		return this[PLAIN_TEXT] && this.closed;
	}


	shouldAppendBlock () {
		return !this.closed;
	}


	appendBlock (block, context) {
		if (block.isPlaintext) {
			this.appendPlaintext(block);
		} else if (block.rangeName === this.rangeName) {
			this.doClose(block);
		}

		const newContext = {...context, openRange: this.closed ? null : this.rangeName};

		return {block: this, context: newContext};
	}


	appendPlaintext (block) {
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
		const plainText = new Plaintext(this.openChars);

		if (this[PLAIN_TEXT]) {
			plainText.appendBlock(this[PLAIN_TEXT]);
		}

		if (this.closed) {
			plainText.appendText(this.closeChars);
		}

		return plainText.getOutput(context);
	}
}
