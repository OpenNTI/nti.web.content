/* eslint-env jest */
import escapeRST from '../escapeRST';

describe('escapeRST', () => {
	describe('escapes rst characters', () => {
		test('!', () => {
			expect(escapeRST('!')).toEqual('\\!');
		});

		test('"', () => {
			expect(escapeRST('"')).toEqual('\\"');
		});

		test('#', () => {
			expect(escapeRST('#')).toEqual('\\#');
		});

		test('$', () => {
			expect(escapeRST('$')).toEqual('\\$');
		});

		test('%', () => {
			expect(escapeRST('%')).toEqual('\\%');
		});

		test('&', () => {
			expect(escapeRST('&')).toEqual('\\&');
		});

		test('\'', () => {
			expect(escapeRST('\'')).toEqual('\\\'');
		});

		test('(', () => {
			expect(escapeRST('(')).toEqual('\\(');
		});

		test(')', () => {
			expect(escapeRST(')')).toEqual('\\)');
		});

		test('*', () => {
			expect(escapeRST('*')).toEqual('\\*');
		});

		test('+', () => {
			expect(escapeRST('+')).toEqual('\\+');
		});

		test(',', () => {
			expect(escapeRST(',')).toEqual('\\,');
		});

		test('-', () => {
			expect(escapeRST('-')).toEqual('\\-');
		});

		test('.', () => {
			expect(escapeRST('.')).toEqual('\\.');
		});

		test('/', () => {
			expect(escapeRST('/')).toEqual('\\/');
		});

		test(':', () => {
			expect(escapeRST(':')).toEqual('\\:');
		});

		test(';', () => {
			expect(escapeRST(';')).toEqual('\\;');
		});

		test('<', () => {
			expect(escapeRST('<')).toEqual('\\<');
		});

		test('=', () => {
			expect(escapeRST('=')).toEqual('\\=');
		});

		test('>', () => {
			expect(escapeRST('>')).toEqual('\\>');
		});

		test('?', () => {
			expect(escapeRST('?')).toEqual('\\?');
		});

		test('@', () => {
			expect(escapeRST('@')).toEqual('\\@');
		});

		test('[', () => {
			expect(escapeRST('[')).toEqual('\\[');
		});

		test('\\', () => {
			expect(escapeRST('\\')).toEqual('\\\\');
		});

		test(']', () => {
			expect(escapeRST(']')).toEqual('\\]');
		});

		test('^', () => {
			expect(escapeRST('^')).toEqual('\\^');
		});

		test('_', () => {
			expect(escapeRST('_')).toEqual('\\_');
		});

		test('`', () => {
			expect(escapeRST('`')).toEqual('\\`');
		});

		test('{', () => {
			expect(escapeRST('{')).toEqual('\\{');
		});

		test('|', () => {
			expect(escapeRST('|')).toEqual('\\|');
		});

		test('}', () => {
			expect(escapeRST('}')).toEqual('\\}');
		});

		test('~', () => {
			expect(escapeRST('~')).toEqual('\\~');
		});
	});

	test('escapes mixed rst characters', () => {
		const text = '.. this is a test';

		expect(escapeRST(text)).toEqual('\\.\\. this is a test');
	});

	test('does not escape non-rst characters', () => {
		const text = 'This is a test paragraph with no rst paragraphs';

		expect(escapeRST(text)).toEqual(text);
	});
});
