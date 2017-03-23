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
	});


	//TODO: Add more tests here
});
