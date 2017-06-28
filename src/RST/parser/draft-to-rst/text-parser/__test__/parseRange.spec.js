/* eslint-env jest */
import {INLINE_STYLE} from 'draft-js-utils';

import parseRange from '../parseRange';

describe('parseRange', () => {
	test('Multiple Leading Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, '    bold');

		expect(parsed).toEqual('    **bold**');
	});

	test('Multiple Trailing Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, 'bold    ');

		expect(parsed).toEqual('**bold**    ');
	});

	test('Multiple Leading and Trailing Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, '    bold    ');

		expect(parsed).toEqual('    **bold**    ');
	});

	describe('Bold', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, 'bold');

			expect(parsed).toEqual('**bold**');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, ' bold');

			expect(parsed).toEqual(' **bold**');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, 'bold ');

			expect(parsed).toEqual('**bold** ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, ' bold ');

			expect(parsed).toEqual(' **bold** ');
		});
	});

	describe('Italic', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'italic');

			expect(parsed).toEqual('*italic*');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' italic');

			expect(parsed).toEqual(' *italic*');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'italic ');

			expect(parsed).toEqual('*italic* ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' italic ');

			expect(parsed).toEqual(' *italic* ');
		});
	});

	describe('Underline', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline');

			expect(parsed).toEqual(':underline:`underline`');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' underline');

			expect(parsed).toEqual(' :underline:`underline`');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline ');

			expect(parsed).toEqual(':underline:`underline` ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' underline ');

			expect(parsed).toEqual(' :underline:`underline` ');
		});

		test('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :underline:`underline`');
		});
	});

	describe('Bold Italic', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic');

			expect(parsed).toEqual(':bolditalic:`bolditalic`');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' bolditalic');

			expect(parsed).toEqual(' :bolditalic:`bolditalic`');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic ');

			expect(parsed).toEqual(':bolditalic:`bolditalic` ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' bolditalic ');

			expect(parsed).toEqual(' :bolditalic:`bolditalic` ');
		});

		test('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :bolditalic:`bolditalic`');
		});
	});

	describe('Bold Underline', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline');

			expect(parsed).toEqual(':boldunderline:`boldunderline`');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' boldunderline');

			expect(parsed).toEqual(' :boldunderline:`boldunderline`');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline ');

			expect(parsed).toEqual(':boldunderline:`boldunderline` ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' boldunderline ');

			expect(parsed).toEqual(' :boldunderline:`boldunderline` ');
		});

		test('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :boldunderline:`boldunderline`');
		});
	});


	describe('Italic Underline', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline');

			expect(parsed).toEqual(':italicunderline:`italicunderline`');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' italicunderline');

			expect(parsed).toEqual(' :italicunderline:`italicunderline`');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline ');

			expect(parsed).toEqual(':italicunderline:`italicunderline` ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' italicunderline ');

			expect(parsed).toEqual(' :italicunderline:`italicunderline` ');
		});

		test('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline', {}, {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]});

			expect(parsed).toEqual('\\ :italicunderline:`italicunderline`');
		});
	});

	describe('Bold Italic Underline', () => {
		test('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline');

			expect(parsed).toEqual(':bolditalicunderline:`bolditalicunderline`');
		});

		test('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' bolditalicunderline');

			expect(parsed).toEqual(' :bolditalicunderline:`bolditalicunderline`');
		});

		test('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline ');

			expect(parsed).toEqual(':bolditalicunderline:`bolditalicunderline` ');
		});

		test('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' bolditalicunderline ');

			expect(parsed).toEqual(' :bolditalicunderline:`bolditalicunderline` ');
		});

		test('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline', {}, {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]});

			expect(parsed).toEqual('\\ :bolditalicunderline:`bolditalicunderline`');
		});
	});

	//TODO: Add more tests here
});
