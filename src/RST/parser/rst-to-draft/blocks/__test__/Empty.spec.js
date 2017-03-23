import Empty from '../Empty';
import {getInterface} from '../../../Parser';

describe('Empty Block', () => {
	describe('isNextBlock', () => {
		it('Matches Empty String', () => {
			const line = '';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Matches Only Whitespace', () => {
			const line = '	   	';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Does not match non whitespace', () => {
			const line = '	a paragraph';
			const inputInterface = getInterface(0, [line]);

			expect(Empty.isNextBlock(inputInterface)).toBeFalsy();
		});
	});
});
