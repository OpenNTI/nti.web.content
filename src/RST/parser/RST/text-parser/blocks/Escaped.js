import Plaintext from './Plaintext';

const ESCAPED_CHAR = '\\';

export default {
	isNextBlock (inputInterface) {
		const current = inputInterface.getInput(0);

		return current === ESCAPED_CHAR;
	},

	parse (inputInterface) {
		const next = inputInterface.getInput(1);

		return {
			block: next ? new Plaintext(next) : {},
			length: 2
		};
	}
};
