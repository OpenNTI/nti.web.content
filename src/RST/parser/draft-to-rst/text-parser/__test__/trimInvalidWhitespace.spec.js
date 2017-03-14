import trimInvalidWhitespace from '../trimInvalidWhitespace';

describe('trimInvalidWhitespace', () => {
	it('All whitespace', () => {
		expect(trimInvalidWhitespace('    	')).toEqual('');
	});

	it('Does not affect no white leading whitespace', () => {
		expect(trimInvalidWhitespace('test')).toEqual('test');
	});

	it('Only trims leading whitespace', () => {
		expect(trimInvalidWhitespace('  test')).toEqual('test');
	});

	it('Leaves trailing whitespace alone', () => {
		expect(trimInvalidWhitespace('  test  ')).toEqual('test  ');
	});
});
