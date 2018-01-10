const WHITE_SPACE_ONLY = /^\s+$/;

export default class Empty {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return WHITE_SPACE_ONLY.test(input) || !input;
	}


	static parse (inputInterface, context) {
		const input = inputInterface.get(0);

		return {block: new this(input), context};
	}

	constructor (rawText) {
		this.rawText = rawText;
	}

	get text () {
		return this.block;
	}

	get raw () {
		return '';
	}

	get block () {
		return this.rawText;
	}

	isEmpty = true
}
