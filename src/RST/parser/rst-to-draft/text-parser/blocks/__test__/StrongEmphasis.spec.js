import StrongEmphasis from '../StrongEmphasis';
import Plaintext from '../Plaintext';

import {getInterface} from '../../../../Parser';

describe('StrongEmphasis', () => {
	describe('isNextBlock', () => {
		it('matchOpen is true for **, and has correct nextChar', () => {
			const test = ['*', '*', 's', 't', 'r', 'o', 'n', 'g'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = StrongEmphasis.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('s');
		});

		it('matchOpen is false for *', () => {
			const test = ['*', 'n', 'o', 't'];
			const inputInterface = getInterface(0, test);
			const {matches} = StrongEmphasis.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchClose is true for **, and has correct nextChar', () => {
			const test = ['*', '*', 'c'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = StrongEmphasis.matchClose(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('c');
		});

		it('matchClose is false for *', () => {
			const test = ['*', 'c'];
			const inputInterface = getInterface(0, test);
			const {matches} = StrongEmphasis.matchClose(inputInterface);

			expect(matches).toBeFalsy();
		});
	});


	describe('getRange', () => {
		it('Has correct offset', () => {
			const strong = new StrongEmphasis('s');

			const range = strong.getRanges({charCount: 0});

			expect(range.inlineStyleRanges.length).toEqual(1);
			expect(range.inlineStyleRanges[0].offset).toEqual(0);
		});

		it('Has correct length', () => {
			const strong = new StrongEmphasis('s');

			strong.appendBlock(new Plaintext('t'));
			strong.appendBlock(new Plaintext('r'));
			strong.appendBlock(new Plaintext('o'));
			strong.appendBlock(new Plaintext('n'));
			strong.appendBlock(new Plaintext('g'));

			strong.appendBlock(new StrongEmphasis());

			const range = strong.getRanges({charCount: 0});

			expect(range.inlineStyleRanges.length).toEqual(1);
			expect(range.inlineStyleRanges[0].length).toEqual(6);
		});
	});
});
