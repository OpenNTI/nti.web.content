import {INLINE_STYLE} from 'draft-js-utils';

import parseText from '../parseText';

describe('parseText', () => {
	it('block with bold', () => {
		const block = {
			text: 'This is a block with bold and some plain',
			inlineStyleRanges: [{
				style: INLINE_STYLE.BOLD,
				offset: 21,
				length: 4
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with **bold** and some plain');
	});

	it('block with underline', () => {
		const block = {
			text: 'This is a block with underline and some plain',
			inlineStyleRanges: [{
				style: INLINE_STYLE.UNDERLINE,
				offset: 21,
				length: 9
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with :underline:`underline` and some plain');
	});

	it('Cleans up leading space', () => {
		const block = {
			text: 'This is a block with bold',
			inlineStyleRanges: [{
				style: INLINE_STYLE.BOLD,
				offset: 20,
				length: 5
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with **bold**');
	});

	it('Cleans up trailing space', () => {
		const block = {
			text: 'This is a block with bold ',
			inlineStyleRanges: [{
				style: INLINE_STYLE.BOLD,
				offset: 21,
				length: 6
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with **bold** ');
	});

	it('Cleans up leading and trailing space', () => {
		const block = {
			text: 'This is a block with bold ',
			inlineStyleRanges: [{
				style: INLINE_STYLE.BOLD,
				offset: 20,
				length: 6
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with **bold** ');
	});

	it('escapes rst thats not in a range', () => {
		const block = {
			text: 'This is a block with * rst chars ** : = !',
			inlineStyleRanges: [],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with \* rst chars \*\* \: \= \!');
	});

	it('escapes rst thats in a range', () => {
		const block = {
			text: 'This is a block with * = ! plus bold and * rst chars ** : = !',
			inlineStyleRanges: [{
				style: INLINE_STYLE.BOLD,
				offset: 32,
				length: 29
			}],
			entityRanges: []
		};
		const parsed = parseText(block, {});

		expect(parsed).toEqual('This is a block with \* \= \! plus **bold and \* rst chars \*\* \: \= \!**');
	});

	//TODO: add more tests
});
