import split from '../Split';

fdescribe('rst-to-draft split', () => {
	it('Splits the input on newline', () => {
		const input = split('Line 1\nLine 2\nLine 3');

		expect(input.length).toEqual(3);
		expect(input[0]).toEqual('Line 1');
		expect(input[1]).toEqual('Line 2');
		expect(input[2]).toEqual('Line 3');
	});
});
