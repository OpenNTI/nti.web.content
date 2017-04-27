import {INLINE_STYLE} from 'draft-js-utils';

import parseRange from '../parseRange';

describe('parseRange', () => {
	it('Multiple Leading Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, '    bold');

		expect(parsed).toEqual('    **bold**');
	});

	it('Multiple Trailing Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, 'bold    ');

		expect(parsed).toEqual('**bold**    ');
	});

	it('Multiple Leading and Trailing Whitespaces', () => {
		const ranges = {styles: [INLINE_STYLE.BOLD]};
		const parsed = parseRange(ranges, '    bold    ');

		expect(parsed).toEqual('    **bold**    ');
	});

	describe('Bold', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, 'bold');

			expect(parsed).toEqual('**bold**');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, ' bold');

			expect(parsed).toEqual(' **bold**');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, 'bold ');

			expect(parsed).toEqual('**bold** ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD]};
			const parsed = parseRange(ranges, ' bold ');

			expect(parsed).toEqual(' **bold** ');
		});
	});

	describe('Italic', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'italic');

			expect(parsed).toEqual('*italic*');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' italic');

			expect(parsed).toEqual(' *italic*');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'italic ');

			expect(parsed).toEqual('*italic* ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' italic ');

			expect(parsed).toEqual(' *italic* ');
		});
	});

	describe('Underline', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline');

			expect(parsed).toEqual(':underline:`underline`');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' underline');

			expect(parsed).toEqual(' :underline:`underline`');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline ');

			expect(parsed).toEqual(':underline:`underline` ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' underline ');

			expect(parsed).toEqual(' :underline:`underline` ');
		});

		it('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'underline', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :underline:`underline`');
		});
	});

	describe('Bold Italic', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic');

			expect(parsed).toEqual(':bolditalic:`bolditalic`');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' bolditalic');

			expect(parsed).toEqual(' :bolditalic:`bolditalic`');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic ');

			expect(parsed).toEqual(':bolditalic:`bolditalic` ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, ' bolditalic ');

			expect(parsed).toEqual(' :bolditalic:`bolditalic` ');
		});

		it('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]};
			const parsed = parseRange(ranges, 'bolditalic', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :bolditalic:`bolditalic`');
		});
	});

	describe('Bold Underline', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline');

			expect(parsed).toEqual(':boldunderline:`boldunderline`');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' boldunderline');

			expect(parsed).toEqual(' :boldunderline:`boldunderline`');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline ');

			expect(parsed).toEqual(':boldunderline:`boldunderline` ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' boldunderline ');

			expect(parsed).toEqual(' :boldunderline:`boldunderline` ');
		});

		it('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'boldunderline', {}, {styles: [INLINE_STYLE.UNDERLINE]} );

			expect(parsed).toEqual('\\ :boldunderline:`boldunderline`');
		});
	});


	describe('Italic Underline', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline');

			expect(parsed).toEqual(':italicunderline:`italicunderline`');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' italicunderline');

			expect(parsed).toEqual(' :italicunderline:`italicunderline`');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline ');

			expect(parsed).toEqual(':italicunderline:`italicunderline` ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' italicunderline ');

			expect(parsed).toEqual(' :italicunderline:`italicunderline` ');
		});

		it('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'italicunderline', {}, {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]});

			expect(parsed).toEqual('\\ :italicunderline:`italicunderline`');
		});
	});

	describe('Bold Italic Underline', () => {
		it('No leading or trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline');

			expect(parsed).toEqual(':bolditalicunderline:`bolditalicunderline`');
		});

		it('Leading whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' bolditalicunderline');

			expect(parsed).toEqual(' :bolditalicunderline:`bolditalicunderline`');
		});

		it('Trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline ');

			expect(parsed).toEqual(':bolditalicunderline:`bolditalicunderline` ');
		});

		it('Leading and trailing whitespace', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, ' bolditalicunderline ');

			expect(parsed).toEqual(' :bolditalicunderline:`bolditalicunderline` ');
		});

		it('Preceded by another Role', () => {
			const ranges = {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]};
			const parsed = parseRange(ranges, 'bolditalicunderline', {}, {styles: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]});

			expect(parsed).toEqual('\\ :bolditalicunderline:`bolditalicunderline`');
		});
	});

	//TODO: Add more tests here
});
