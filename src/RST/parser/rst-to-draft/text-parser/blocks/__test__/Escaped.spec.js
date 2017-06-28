/* eslint-env jest */
import Escaped from '../Escaped';
import {getInterface} from '../../../../Parser';

describe('Escaped', () => {
	describe('isNextBlock', () => {
		test('Is valid for \\', () => {
			const test = ['\\'];
			const inputInterface = getInterface(0, test);

			expect(Escaped.isNextBlock(inputInterface)).toBeTruthy();
		});

		test('Is not valid for not \\', () => {
			const test = ['a'];
			const inputInterface = getInterface(0, test);

			expect(Escaped.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		test('Returns a Plaintext block', () => {
			const test = ['\\', '\\'];
			const inputInterface = getInterface(0, test);
			const {block} = Escaped.parse(inputInterface);

			expect(block.isPlaintext).toBeTruthy();
		});

		test('Consumes the next char', () => {
			const test = ['\\', '\\'];
			const inputInterface = getInterface(0, test);
			const {length} = Escaped.parse(inputInterface);

			expect(length).toEqual(2);
		});
	});
});
