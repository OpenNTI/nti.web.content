import Escaped from '../Escaped';
import {getInterface} from '../../../../Parser';

describe('Escaped', () => {
	describe('isNextBlock', () => {
		it('Is valid for \\', () => {
			const test = ['\\'];
			const inputInterface = getInterface(0, test);

			expect(Escaped.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Is not valid for not \\', () => {
			const test = ['a'];
			const inputInterface = getInterface(0, test);

			expect(Escaped.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		it('Returns a Plaintext block', () => {
			const test = ['\\', '\\'];
			const inputInterface = getInterface(0, test);
			const {block} = Escaped.parse(inputInterface);

			expect(block.isPlaintext).toBeTruthy();
		});

		it('Consumes the next char', () => {
			const test = ['\\', '\\'];
			const inputInterface = getInterface(0, test);
			const {length} = Escaped.parse(inputInterface);

			expect(length).toEqual(2);
		});
	});
});
