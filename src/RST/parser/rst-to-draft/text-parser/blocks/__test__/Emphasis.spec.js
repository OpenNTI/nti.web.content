/* eslint-env jest */
import Emphasis from '../Emphasis';
import Plaintext from '../Plaintext';
import {getInterface} from '../../../../Parser';

describe('Emphasis', () => {
	describe('isNextBlock', () => {
		test('matchOpen true for *', () => {
			const chars = ['*', 'e', 'm', 'p'];
			const inputInterface = getInterface(0, chars);
			const {matches} = Emphasis.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
		});

		test('matchOpen false for **', () => {
			const chars = ['*', '*', 'e', 'm', 'p'];
			const inputInterface = getInterface(0, chars);
			const {matches} = Emphasis.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		test('matchClose true for *', () => {
			const chars = ['*', 'e', 'm', 'p'];
			const inputInterface = getInterface(0, chars);
			const {matches} = Emphasis.matchClose(inputInterface);

			expect(matches).toBeTruthy();
		});

		test('matchClose false for **', () => {
			const chars = ['*', '*', 'e', 'm', 'p'];
			const inputInterface = getInterface(0, chars);
			const {matches} = Emphasis.matchClose(inputInterface);

			expect(matches).toBeFalsy();
		});
	});

	describe('Parse', () => {
		test('Opening Range consumes 1 character and opens a range', () => {
			const chars = ['*', 'e', 'm', 'p'];
			const inputInterface = getInterface(0, chars);
			const {block, context, length} = Emphasis.parse(inputInterface, {});

			expect(context.openRange).toEqual(Emphasis.rangeName);
			expect(block.text).toEqual('');
			expect(length).toEqual(1);
		});

		test('Closing Range consumes 1 character and closes the range', () => {
			const chars = ['*', ' ', 'n', 'o', 't'];
			const inputInterface = getInterface(0, chars);
			const {block, length} = Emphasis.parse(inputInterface, {openRange: Emphasis.rangeName});

			//The open range is cleared out when this block is appended
			// expect(context.openRange).toBeFalsy();
			expect(block.text).toEqual('');
			expect(length).toEqual(1);
		});
	});

	describe('getRanges', () => {
		test('Has Correct Offset', () => {
			const block = new Emphasis('e');
			const {inlineStyleRanges} = block.getRanges({charCount: 30});

			expect(inlineStyleRanges.length).toEqual(1);
			expect(inlineStyleRanges[0].offset).toEqual(30);
		});

		test('Has Correct Length', () => {
			const block = new Emphasis('e');

			block.appendBlock(new Plaintext('m'));
			block.appendBlock(new Plaintext('p'));
			block.appendBlock(new Plaintext('h'));
			block.appendBlock(new Plaintext('a'));
			block.appendBlock(new Plaintext('s'));
			block.appendBlock(new Plaintext('i'));
			block.appendBlock(new Plaintext('s'));

			const {inlineStyleRanges} = block.getRanges({charCount: 0});

			expect(inlineStyleRanges.length).toEqual(1);
			expect(inlineStyleRanges[0].length).toEqual(8);
		});
	});
});
