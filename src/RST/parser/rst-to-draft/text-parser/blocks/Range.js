import Plaintext from './Plaintext';
import Regex from '../Regex';

const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Text');


export default class Range {
	static rangeName = 'range'
	static openChars = ''
	static closeChars = ''

	static matchOpen () {
		return {matches: true, nextChar: '', prevChar: ''};
	}

	static matchClose (...args) {
		return this.matchOpen(...args); //By default assume the ranges are symmetrical
	}

	static isNextBlock (inputInterface, context, parsedInterface) {
		const maybeOpening = !context.openRange;
		const maybeClosing = context.openRange === this.rangeName;

		const  {matches, nextChar, prevChar} = maybeOpening ?
										this.matchOpen(inputInterface, context, parsedInterface) :
										this.matchClose(inputInterface, context, parsedInterface);

		const prevInput = prevChar || inputInterface.get(-1);
		const nextInput = nextChar || inputInterface.get(this.openChars.length);

		const isValidStart = Regex.isValidRangeStart(prevInput, nextInput);
		const isValidEnd = Regex.isValidRangeEnd(prevInput, nextInput);

		return matches && //the block is either a valid open or close for this range
				(maybeOpening || maybeClosing) && //and we are opening or closing this range (not parsing another one)
				((maybeOpening && isValidStart) || (maybeClosing && isValidEnd)); //and we are a valid start or end to our range
	}


	static parse (inputInterface, context, parsedInterface) {
		const openedRange = !context.openRange;
		const length = openedRange ? this.openChars.length : this.closeChars.length;
		const newContext = {...context, isEscaped: false, openRange: this.rangeName};

		const block = new this();

		return {
			block: this.afterParse(block, inputInterface, context, parsedInterface),
			context: newContext,
			length: length
		};
	}


	static afterParse (block/*, inputInterface, context, parsedInterface*/) {
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
