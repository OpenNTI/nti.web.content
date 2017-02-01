import Split from '../Split';

describe('text-parser Split', () => {
	it('Splits input as expected', () => {
		const input = Split('split');

		expect(input.length).toEqual(5);
		expect(input[0]).toEqual('s');
		expect(input[1]).toEqual('p');
		expect(input[2]).toEqual('l');
		expect(input[3]).toEqual('i');
		expect(input[4]).toEqual('t');
	});
});
