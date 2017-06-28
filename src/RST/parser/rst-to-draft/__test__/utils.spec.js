/* eslint-env jest */
import {getIndention, normalizeEntityName} from '../utils';

describe('RST Parser Utils', () => {
	describe('getIndention tests', () => {
		describe('No block indicator', () => {
			test('Tabs Only, no extra space', () => {
				const test = '			block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(3);
			});

			test('Spaces only, no extra space', () => {
				const test = '      block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			test('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(4);
			});

			test('Tabs Only, with extra space', () => {
				const test = '			 block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(4);
			});

			test('Spaces only, with extra space', () => {
				const test = '       block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(7);
			});

			test('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	 block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(5);
			});
		});

		describe('With block indicator', () => {
			test('Tabs Only, no extra space', () => {
				const test = '			aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(5);
			});

			test('Spaces only, no extra space', () => {
				const test = '      aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(8);
			});

			test('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			test('Tabs Only, with extra space', () => {
				const test = '			aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			test('Spaces only, with extra space', () => {
				const test = '      aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(9);
			});

			test('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(7);
			});
		});
	});

	describe('normalizeEntityName tests', () => {
		test('normalizes whitespace', () => {
			const base = '		two tabs';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual('  two tabs');
		});

		test('normalizes case', () => {
			const base = 'UpPeR AnD LoWeR CaSe';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual('upper and lower case');
		});

		test('normalizes both', () => {
			const base = '	UPPER and lower case';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual(' upper and lower case');
		});
	});
});
