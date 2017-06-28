/* eslint-env jest */
import FieldList from '../FieldList';
import {getInterface} from '../../../Parser';

describe('FieldList', () => {
	describe('isNextBlock', () => {
		test('Matches on a field list', () => {
			const rst = ':name: value';
			const inputInterface = getInterface(0, [rst]);

			expect(FieldList.isNextBlock(inputInterface)).toBeTruthy();
		});

		test('Does not match on non field lists', () => {
			const rst = 'paragraph';
			const inputInterface = getInterface(0, [rst]);

			expect(FieldList.isNextBlock(inputInterface)).toBeFalsy();
		});

		test('Does not match on roles', () => {
			const rst = ':underline:`underlined`';
			const inputInterface = getInterface(0, [rst]);

			expect(FieldList.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		test('Parses name', () => {
			const name = 'name';
			const rst = `:${name}:value`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.name).toEqual(name);
		});

		test('Parses value with space', () => {
			const value = 'value';
			const rst = `:name: ${value}`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.value).toEqual(value);
		});

		test.skip('Parses value without space', () => {
			const value = 'value';
			const rst = `:name:${value}`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.value).toEqual(value);
		});
	});
});
