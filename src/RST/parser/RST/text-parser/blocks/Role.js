const CLOSED = Symbol('Closed');
const NAME = Symbol('Name');
const USED = Symbol('Used');

const RANGE_NAME = 'Role';

//If this isn't closed properly it should be treated as plain text.
export default class Role {
	static isTypeForBlock (block, context) {
		return block === ':' && !context.isEscaped;
	}

	static parse (block, context) {
		const newContext = {...context, isEscaped: false, openRange: RANGE_NAME};

		return {block: new this(block), context: newContext};
	}

	isRole = true

	constructor () {
		this[CLOSED] = false;
		this[NAME] = '';
	}


	shouldAppendBlock (block) {
		return !this[CLOSED] || (!this[USED] && block.isInterpreted);
	}


	appendBlock (block, context) {
		let nextBlock;

		if (block.isPlainText) {
			this[NAME] += block.text;
			nextBlock = this;
		} else if (block.isRole) {
			this[CLOSED] = true;
			nextBlock = this;
		} else if (block.isInterpreted) {
			this[USED] = true;
			block.setOutputFn(c => this.getInterpretedOutput(c));
			nextBlock = block;
		}

		const newContext = {...context, openRange: this[CLOSED] ? null : RANGE_NAME};

		return {block: nextBlock, context: newContext};
	}


	getInterpretedOutput (context) {
		debugger;
	}
}
