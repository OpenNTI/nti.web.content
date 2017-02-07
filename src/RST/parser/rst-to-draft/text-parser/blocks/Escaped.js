import Plaintext from './Plaintext';

const ESCAPED_CHAR = '\\';

export default {
	isNextBlock (inputInterface) {
		const current = inputInterface.get(0);

		return current === ESCAPED_CHAR;
	},

	parse (inputInterface) {
		const next = inputInterface.get(1);

		return {
			block: next ? new Plaintext(next) : {},
			length: 2
		};
	}
};
