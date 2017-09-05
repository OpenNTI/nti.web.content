/* eslint-env jest */
import Regex from '../Regex';

describe('text-parser Regex', () => {
	describe('isWhitespaceChar', () => {
		test('is true for whitespace', () => {
			expect(Regex.isWhitespaceChar(' ')).toBeTruthy();
			expect(Regex.isWhitespaceChar('	')).toBeTruthy();
			expect(Regex.isWhitespaceChar('\n')).toBeTruthy();
		});

		test('is false for non-whitespace', () => {
			expect(Regex.isWhitespaceChar('a')).toBeFalsy();
			expect(Regex.isWhitespaceChar(',')).toBeFalsy();
			expect(Regex.isWhitespaceChar('1')).toBeFalsy();
		});
	});

	describe('isNotWhitespaceChar', () => {
		test('is true for non-whitespace', () => {
			expect(Regex.isNotWhitespaceChar('a')).toBeTruthy();
			expect(Regex.isNotWhitespaceChar(',')).toBeTruthy();
			expect(Regex.isNotWhitespaceChar('1')).toBeTruthy();
		});

		test('is false for whitespace', () => {
			expect(Regex.isNotWhitespaceChar(' ')).toBeFalsy();
			expect(Regex.isNotWhitespaceChar('	')).toBeFalsy();
			expect(Regex.isNotWhitespaceChar('\n')).toBeFalsy();
		});
	});

	describe('isWhitespaceOnly', () => {
		test('is true for whitespace only', () => {
			expect(Regex.isWhitespaceOnly('    ')).toBeTruthy();
			expect(Regex.isWhitespaceOnly(' 	\n ')).toBeTruthy();
			expect(Regex.isWhitespaceOnly(' ')).toBeTruthy();
		});

		test('is false for not whitespace only', () => {
			expect(Regex.isWhitespaceOnly('aaa')).toBeFalsy();
			expect(Regex.isWhitespaceOnly('   a   ')).toBeFalsy();
			expect(Regex.isWhitespaceOnly('		a')).toBeFalsy();
		});
	});

	describe('endsInWhitespace', () => {
		test('is true if ends in whitespace', () => {
			expect(Regex.endsInWhitespace('asdf ')).toBeTruthy();
			expect(Regex.endsInWhitespace('   ')).toBeTruthy();
			expect(Regex.endsInWhitespace('puncuation. ')).toBeTruthy();
		});

		test('is false if does not end in whitespace', () => {
			expect(Regex.endsInWhitespace(' asdf')).toBeFalsy();
			expect(Regex.endsInWhitespace('  f')).toBeFalsy();
			expect(Regex.endsInWhitespace('  asdf.')).toBeFalsy();
		});
	});

	describe('doesNotEndInWhitespace', () => {
		test('is true if does not end in whitespace', () => {
			expect(Regex.doesNotEndInWhitespace(' asdf')).toBeTruthy();
			expect(Regex.doesNotEndInWhitespace(' f')).toBeTruthy();
			expect(Regex.doesNotEndInWhitespace('  asdf.')).toBeTruthy();
		});

		test('is false if does end in whitespace', () => {
			expect(Regex.doesNotEndInWhitespace('asdf ')).toBeFalsy();
			expect(Regex.doesNotEndInWhitespace('   ')).toBeFalsy();
			expect(Regex.doesNotEndInWhitespace(' asdf.')).toBeTruthy();
		});
	});

	describe('isOpen', () => {
		test('is true for open characters', () => {
			expect(Regex.isOpen('\'')).toBeTruthy();
			expect(Regex.isOpen('"')).toBeTruthy();
			expect(Regex.isOpen('<')).toBeTruthy();
			expect(Regex.isOpen('(')).toBeTruthy();
			expect(Regex.isOpen('[')).toBeTruthy();
			expect(Regex.isOpen('{')).toBeTruthy();
		});

		test('is false for non-open characters', () => {
			expect(Regex.isOpen('>')).toBeFalsy();
			expect(Regex.isOpen(')')).toBeFalsy();
			expect(Regex.isOpen(']')).toBeFalsy();
			expect(Regex.isOpen('}')).toBeFalsy();
			expect(Regex.isOpen('a')).toBeFalsy();
		});
	});

	describe('isClose', () => {
		test('is true for close characters', () => {
			expect(Regex.isClose('\'')).toBeTruthy();
			expect(Regex.isClose('"')).toBeTruthy();
			expect(Regex.isClose('>')).toBeTruthy();
			expect(Regex.isClose(')')).toBeTruthy();
			expect(Regex.isClose(']')).toBeTruthy();
			expect(Regex.isClose('}')).toBeTruthy();
		});

		test('is false for non-close characters', () => {
			expect(Regex.isClose('<')).toBeFalsy();
			expect(Regex.isClose('(')).toBeFalsy();
			expect(Regex.isClose('[')).toBeFalsy();
			expect(Regex.isClose('{')).toBeFalsy();
			expect(Regex.isClose('a')).toBeFalsy();
		});
	});


	describe('isValidRangeStart', () => {
		describe('simple', () => {
			test('is true if there is a non-whitespace nextChar and not wrapped in open/close chars', () => {
				expect(Regex.isValidRangeStart('', 'a')).toBeTruthy();
			});

			test('is false if no nextChar', () => {
				expect(Regex.isValidRangeStart('', '')).toBeFalsy();
			});

			test('is false if next char is whitespace', () => {
				expect(Regex.isValidRangeStart('', ' ')).toBeFalsy();
			});

			test('is false it wrapped in open/close chars', () => {
				expect(Regex.isValidRangeStart('(', ')')).toBeFalsy();
			});
		});

		describe('not simple', () => {
			test('is true if there is a valid prevChar', () => {
				expect(Regex.isValidRangeStart('', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('-', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart(':', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('/', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('\'', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('"', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('<', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('(', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('[', 'a', false)).toBeTruthy();
				expect(Regex.isValidRangeStart('{', 'a', false)).toBeTruthy();
			});

			test('is false if the prevChar is invalid', () => {
				expect(Regex.isValidRangeStart('a', 'a', false)).toBeFalsy();
				//TODO: find more invalid chars
			});
		});
	});


	describe('isValidRangeEnd', () => {
		describe('simple', () => {
			test('is true if the prevChar is not whitespace', () => {
				expect(Regex.isValidRangeEnd('a', 'a')).toBeTruthy();
				expect(Regex.isValidRangeEnd('.', 'a')).toBeTruthy();
			});

			test('is false if the prevChar is whitespace', () => {
				expect(Regex.isValidRangeEnd(' ', 'a')).toBeFalsy();
				expect(Regex.isValidRangeEnd('	', 'a')).toBeFalsy();
			});
		});

		describe('not simple', () => {
			test('is true if there is a valid nextChar', () => {
				expect(Regex.isValidRangeEnd('a', '', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ' ', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '-', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '.', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ',', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ':', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ';', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '!', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '?', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '\\', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '/', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '\'', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '"', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ')', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', ']', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '}', false)).toBeTruthy();
				expect(Regex.isValidRangeEnd('a', '>', false)).toBeTruthy();
			});

			test('is false if there is not a valid nextChar', () => {
				expect(Regex.isValidRangeEnd('a', 'a', false)).toBeFalsy();
				//TODO: find more invalid chars
			});
		});
	});

});
