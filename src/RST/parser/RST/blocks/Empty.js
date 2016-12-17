const WHITE_SPACE_ONLY = /^\s+$/;

export default  {
	isNextBlock (inputInterface) {
		const input = inputInterface.getInput();

		return WHITE_SPACE_ONLY.test(input) || !input;
	},

	parse (inputInterface, context) {
		return {context};
	}
};
