const BLOCK = Symbol('Block');
const PARTS = Symbol('Parts');
const IS_CONSUMED = Symbol('Is Consumed');

export default class Block {
	static isTypeForBlock () { return true; }

	static parse (block, context) {
		return {block: new this(block), context};
	}

	constructor (block, parts) {
		this[BLOCK] = block;
		this[PARTS] = parts;
	}


	get block () {
		return this[BLOCK];
	}


	get parts () {
		return this[PARTS];
	}


	consume () {
		this[IS_CONSUMED] = true;
	}


	get isConsumed () {
		return this[IS_CONSUMED];
	}


	getOutput (context, force)  {
		if (this.isConsumed && !force) { return null; }

		return this.toDraft(context);
	}


	toDraft (/*context*/) {
		return this.parts;
	}


	shouldAppendBlock (/*block, context*/) {
		return false;
	}


	appendBlock (/*block, context*/) {}
}
