import FieldList from '../FieldList';

import {getInterface} from '../../../Parser';

describe('FieldList', () => {
	describe('isNextBlock', () => {
		it('Matches on a field list', () => {
			const rst = ':name: value';
			const inputInterface = getInterface(0, [rst]);

			expect(FieldList.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Does not match on non field lists', () => {
			const rst = 'paragraph';
			const inputInterface = getInterface(0, [rst]);

			expect(FieldList.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		it('Parses name', () => {
			const name = 'name';
			const rst = `:${name}:value`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.name).toEqual(name);
		});

		it('Parses value with space', () => {
			const value = 'value';
			const rst = `:name: ${value}`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.value).toEqual(value);
		});

		it('Parses value without space', () => {
			const value = 'value';
			const rst = `:name:${value}`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = FieldList.parse(inputInterface);

			expect(block.value).toEqual(value);
		});
	});
});
