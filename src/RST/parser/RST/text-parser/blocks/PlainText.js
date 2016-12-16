const TEXT = Symbol('Text');

export default class Plaintext {
	static isTypeForBlock () {
		return true;
	}

	static parse (block, context) {
		return {block: new this(block), context: {...context, isEscaped: false, openRange: false}};
	}

	isPlainText = true

	constructor (block) {
		this[TEXT] = block;
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


	shouldAppendBlock (block) {
		return block.isPlainText;
	}


	appendBlock (block, context) {
		this[TEXT] = this[TEXT] + block.text;

		return {block: this, context};
	}


	appendText (text) {
		if (!text) {
			debugger;
		}

		this[TEXT] = this[TEXT] + text;
	}


	getOutput (context) {
		const newContext = {...context, charCount: context.charCount + this.text.length};

		if (!this.text) {
			debugger;
		}

		return {output: this.text, context: newContext};
	}
}
