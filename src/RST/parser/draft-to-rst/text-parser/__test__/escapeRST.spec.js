import escapeRST from '../escapeRST';

describe('escapeRST', () => {
	describe('escapes rst characters', () => {
		it('!', () => {
			expect(escapeRST('!')).toEqual('\\!');
		});

		it('"', () => {
			expect(escapeRST('"')).toEqual('\\"');
		});

		it('#', () => {
			expect(escapeRST('#')).toEqual('\\#');
		});

		it('$', () => {
			expect(escapeRST('$')).toEqual('\\$');
		});

		it('%', () => {
			expect(escapeRST('%')).toEqual('\\%');
		});

		it('&', () => {
			expect(escapeRST('&')).toEqual('\\&');
		});

		it('\'', () => {
			expect(escapeRST('\'')).toEqual('\\\'');
		});

		it('(', () => {
			expect(escapeRST('(')).toEqual('\\(');
		});

		it(')', () => {
			expect(escapeRST(')')).toEqual('\\)');
		});

		it('*', () => {
			expect(escapeRST('*')).toEqual('\\*');
		});

		it('+', () => {
			expect(escapeRST('+')).toEqual('\\+');
		});

		it(',', () => {
			expect(escapeRST(',')).toEqual('\\,');
		});

		it('-', () => {
			expect(escapeRST('-')).toEqual('\\-');
		});

		it('.', () => {
			expect(escapeRST('.')).toEqual('\\.');
		});

		it('/', () => {
			expect(escapeRST('/')).toEqual('\\/');
		});

		it(':', () => {
			expect(escapeRST(':')).toEqual('\\:');
		});

		it(';', () => {
			expect(escapeRST(';')).toEqual('\\;');
		});

		it('<', () => {
			expect(escapeRST('<')).toEqual('\\<');
		});

		it('=', () => {
			expect(escapeRST('=')).toEqual('\\=');
		});

		it('>', () => {
			expect(escapeRST('>')).toEqual('\\>');
		});

		it('?', () => {
			expect(escapeRST('?')).toEqual('\\?');
		});

		it('@', () => {
			expect(escapeRST('@')).toEqual('\\@');
		});

		it('[', () => {
			expect(escapeRST('[')).toEqual('\\[');
		});

		it('\\', () => {
			expect(escapeRST('\\')).toEqual('\\\\');
		});

		it(']', () => {
			expect(escapeRST(']')).toEqual('\\]');
		});

		it('^', () => {
			expect(escapeRST('^')).toEqual('\\^');
		});

		it('_', () => {
			expect(escapeRST('_')).toEqual('\\_');
		});

		it('`', () => {
			expect(escapeRST('`')).toEqual('\\`');
		});

		it('{', () => {
			expect(escapeRST('{')).toEqual('\\{');
		});

		it('|', () => {
			expect(escapeRST('|')).toEqual('\\|');
		});

		it('}', () => {
			expect(escapeRST('}')).toEqual('\\}');
		});

		it('~', () => {
			expect(escapeRST('~')).toEqual('\\~');
		});
	});

	it('escapes mixed rst characters', () => {
		const text = '.. this is a test';

		expect(escapeRST(text)).toEqual('\\.\\. this is a test');
	});

	it('does not escape non-rst characters', () => {
		const text = 'This is a test paragraph with no rst paragraphs';

		expect(escapeRST(text)).toEqual(text);
	});
});
