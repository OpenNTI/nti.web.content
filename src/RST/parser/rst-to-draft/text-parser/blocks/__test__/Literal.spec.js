import {INLINE_STYLE} from 'draft-js-utils';

import Literal from '../Literal';
import Plaintext from '../Plaintext';

import {getInputInterface} from '../../../../Parser';

fdescribe('Literal', () => {
	describe('isNextBlock', () => {
		it('matchOpen is true for ``', () => {
			const test = ['`', '`', 'l', 'i', 't', 'e', 'r', 'a', 'l'];
			const inputInterface = getInputInterface(0, test);
			const {matches, nextChar} = Literal.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('l');
		});

		it('matchOpen is false for `', () => {
			const test = ['`', 'i', 'n', 't', 'e', 'r', 'p', 'r', 'e', 't', 'e', 'd'];
			const inputInterface = getInputInterface(0, test);
			const {matches} = Literal.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchClose is true for ``', () => {
			const test = ['`', '`', 'a'];
			const inputInterface = getInputInterface(0, test);
			const {matches, nextChar} = Literal.matchClose(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('a');
		});

		it('matchClose is false for `', () => {
			const test = ['`', 'a'];
			const inputInterface = getInputInterface(0, test);
			const {matches} = Literal.matchClose(inputInterface);

			expect(matches).toBeFalsy();
		});
	});


	describe('getRanges', () => {
		it('getRanges returns the proper range', () => {
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
