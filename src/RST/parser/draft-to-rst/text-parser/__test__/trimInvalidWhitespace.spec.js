/* eslint-env jest */
import trimInvalidWhitespace from '../trimInvalidWhitespace';

describe('trimInvalidWhitespace', () => {
	test('All whitespace', () => {
		expect(trimInvalidWhitespace('    	')).toEqual('');
	});

	test('Does not affect no white leading whitespace', () => {
		expect(trimInvalidWhitespace('test')).toEqual('test');
	});

	test('Only trims leading whitespace', () => {
		expect(trimInvalidWhitespace('  test')).toEqual('test');
	});

	test('Leaves trailing whitespace alone', () => {
		expect(trimInvalidWhitespace('  test  ')).toEqual('test  ');
	});
});
