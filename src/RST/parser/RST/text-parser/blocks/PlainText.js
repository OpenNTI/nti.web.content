const TEXT = Symbol('Text');

export default class PlainText {
	static isTypeForBlock () {
		return true;
	}

	static parse (block, context) {
		return {block: new this(block), context: {...context, isEscaped: false}};
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


	shouldAppendBlock (block) {
		return block.isPlainText;
	}


	appendBlock (block, context) {
		this[TEXT] = this[TEXT] + block.text;

		return {block: this, context};
	}


	getOutput (context) {
		const newContext = {...context, charCount: context.charCount + this.text.length};

		return {output: this.text, context: newContext};
	}
}
