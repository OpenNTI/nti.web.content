const WHITE_SPACE_ONLY = /^\s+$/;

export default class Empty  {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return WHITE_SPACE_ONLY.test(input) || !input;
	}


	static parse (inputInterface, context) {
		return {block: new this(), context};
	}


	isEmpty = true
}
