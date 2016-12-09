const WHITE_SPACE_ONLY = /^\s+$/;

export default  {
	isTypeForBlock (block) {
		return WHITE_SPACE_ONLY.test(block) || !block;
	},

	parse (block, context) {
		return {context};
	}
};
