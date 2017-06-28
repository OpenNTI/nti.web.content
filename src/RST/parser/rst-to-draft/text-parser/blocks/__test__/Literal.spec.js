/* eslint-env jest */
import {INLINE_STYLE} from 'draft-js-utils';

import Literal from '../Literal';
import Plaintext from '../Plaintext';
import {getInterface} from '../../../../Parser';

describe('Literal', () => {
	describe('isNextBlock', () => {
		test('matchOpen is true for ``', () => {
			const test = ['`', '`', 'l', 'i', 't', 'e', 'r', 'a', 'l'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = Literal.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('l');
		});

		test('matchOpen is false for `', () => {
			const test = ['`', 'i', 'n', 't', 'e', 'r', 'p', 'r', 'e', 't', 'e', 'd'];
			const inputInterface = getInterface(0, test);
			const {matches} = Literal.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		test('matchClose is true for ``', () => {
			const test = ['`', '`', 'a'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = Literal.matchClose(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('a');
		});

		test('matchClose is false for `', () => {
			const test = ['`', 'a'];
			const inputInterface = getInterface(0, test);
			const {matches} = Literal.matchClose(inputInterface);

			expect(matches).toBeFalsy();
		});
	});


	describe('getRanges', () => {
		test('getRanges returns the proper range', () => {
			const block = new Literal();

			block.appendBlock(new Plaintext('l'));
			block.appendBlock(new Plaintext('i'));
			block.appendBlock(new Plaintext('t'));
			block.appendBlock(new Plaintext('e'));
			block.appendBlock(new Plaintext('r'));
			block.appendBlock(new Plaintext('a'));
			block.appendBlock(new Plaintext('l'));

			block.appendBlock(new Literal());

			const {inlineStyleRanges} = block.getRanges({charCount: 0});

			expect(inlineStyleRanges.length).toEqual(1);
			expect(inlineStyleRanges[0].style).toEqual(INLINE_STYLE.CODE);
			expect(inlineStyleRanges[0].offset).toEqual(0);
			expect(inlineStyleRanges[0].length).toEqual(7);
		});
	});
});
