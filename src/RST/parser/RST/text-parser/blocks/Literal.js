const CLOSED = Symbol('Closed');
const PLAIN_TEXT = Symbol('Plain Text');

const RANGE_NAME = 'Literal';

export default class Literal {
	static isTypeForBlock (blockInput, context, nextInput) {
		return blockInput === '`' && nextInput === '`' && //If its a back tick followed by another back tick
					!context.isEscaped && //and we aren't escaped
					(!context.openRange || context.openRange === RANGE_NAME); //and we aren't parsing another range
	}

	static parse (blockInput, context) {
		const newContext = {...context, isEscaped: false, openRange: RANGE_NAME};

		return {block: new this(blockInput), context: newContext};
	}


	constructor () {
		this[CLOSED] = false;
	}


	shouldAppendBlock (block) {
		return !this[CLOSED];
	}


	appendBlock (block) {

	}
}
