import Regex from '../Regex';

const TEXT = Symbol('Text');
const IS_CONSUMED = Symbol('Consumed');

export default class Plaintext {
	static isNextBlock () {
		return true;
	}

	static parse (inputInterface, context) {
		const input = inputInterface.getInput();

		return {block: new this(input), context: {...context, isEscaped: false, openRange: false}};
	}

	isPlaintext = true

	constructor (block) {
		this[TEXT] = block || '';
	}


	get text () {
		return this[TEXT];
	}

	get length () {
		return this.text.length;
	}

	get isWhitespace () {
		return /^\s$/.test(this.text);
	}


	get endsInWhitespace () {
		return /\s$/.test(this.text);
	}


	get isConsumed () {
		return this[IS_CONSUMED];
	}

	consume () {
		this[IS_CONSUMED] = true;
	}


	shouldAppendBlock (block) {
		return block.isPlaintext && Regex.doesNotEndInWhitespace(this.text);
	}


	appendBlock (block, context) {
		this[TEXT] = this[TEXT] + block.text;

		return {block: this, context};
	}


	appendText (text) {
		this[TEXT] = this[TEXT] + text;
	}


	getOutput (context) {
		if (this.isConsumed) {
			return null;
		}

		const newContext = {...context, charCount: context.charCount + this.text.length};

		return {output: this.text, context: newContext};
	}
}
