import Regex from '../Regex';

const TEXT = Symbol('Text');
const ROLE_MARKER = Symbol('Role Marker');

export default class Plaintext {
	static isNextBlock () {
		return true;
	}

	static parse (inputInterface, context, currentBlock) {
		const input = inputInterface.getInput();
		const block = new this(input);

		if (currentBlock && currentBlock.isTarget && !block.isWhitespace) {
			currentBlock.setMarkerFor(block);
			block.setRoleMarker(currentBlock);
		}

		return {block, context: {...context, openRange: false}};
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


	get roleMarker () {
		return this[ROLE_MARKER];
	}


	setRoleMarker (marker) {
		this[ROLE_MARKER] = marker;
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


	getOutput (context, force) {
		if (this[ROLE_MARKER] && !force) {
			return this[ROLE_MARKER].getOutputForInterpreted(this, context);
		}

		const newContext = {...context, charCount: context.charCount + this.text.length};

		return {output: this.text, context: newContext};
	}
}
