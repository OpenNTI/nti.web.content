const BLOCK = Symbol('Block');
const PARTS = Symbol('Parts');
const IS_CONSUMED = Symbol('Is Consumed');
const BLOCK_DATA = Symbol('BLOCK_DATA');

export default class Block {
	static isNextBlock () { return true; }

	static parse (block, context) {
		return {block: new this(block), context};
	}

	constructor (block, parts) {
		this[BLOCK] = block;
		this[PARTS] = parts;

		this[BLOCK_DATA] = {};
	}


	get block () {
		return this[BLOCK];
	}


	get parts () {
		return this[PARTS];
	}


	get blockData () {
		return this[BLOCK_DATA];
	}


	setBlockData (key, value) {
		this[BLOCK_DATA][key] = value;
	}


	consume () {
		this[IS_CONSUMED] = true;
	}


	get isConsumed () {
		return this[IS_CONSUMED];
	}


	toDraft (context, force)  {
		if (this.isConsumed && !force) { return null; }

		return this.getOutput(context);
	}


	getOutput (context) {
		return {output: this.parts, context};
	}


	shouldAppendBlock (/*block, context*/) {
		return false;
	}


	appendBlock (/*block, context*/) {}
}
