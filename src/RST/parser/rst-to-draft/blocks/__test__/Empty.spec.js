/* eslint-env jest */
import Empty from '../Empty';
import {getInterface} from '../../../Parser';

describe('Empty Block', () => {
	describe('isNextBlock', () => {
		test('Matches Empty String', () => {
			const line = '';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeTruthy();
		});

		test('Matches Only Whitespace', () => {
			const line = '	   	';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeTruthy();
		});

		test('Does not match non whitespace', () => {
			const line = '	a paragraph';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeFalsy();
		});
	});
});
