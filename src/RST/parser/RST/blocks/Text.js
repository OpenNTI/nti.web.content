const TEXT = Symbol('Text');
const IS_CONSUMED = Symbol('Is Consumed');

const WHITE_SPACE_ONLY = /^\s+$/;

export default class Text {
	static isTypeForBlock (block) {
		return !WHITE_SPACE_ONLY.test(block);
	}

	static parse (block, context) {
		return {block: new this(block), context};
	}

	isTextBlock = true

	constructor (block) {
		//TODO: parse out the parts of the text
		this[TEXT] = block;
	}

	get text () {
		return this[TEXT];
	}

	consume () {
		this[IS_CONSUMED] = true;
	}
}
