import Block from '../Block';

describe('Base Block tests', () => {
	it('Does not output if consumed', () => {
		const block = new Block();

		block.consume();

		expect(block.toDraft()).toBeNull();
	});
});
