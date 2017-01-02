import {getIndention, normalizeEntityName} from '../utils';

describe('RST Parser Utils', () => {
	describe('getIndention tests', () => {
		describe('No block indicator', () => {
			it('Tabs Only, no extra space', () => {
				const test = '			block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(3);
			});

			it('Spaces only, no extra space', () => {
				const test = '      block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			it('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(4);
			});

			it('Tabs Only, with extra space', () => {
				const test = '			 block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(4);
			});

			it('Spaces only, with extra space', () => {
				const test = '       block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(7);
			});

			it('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	 block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(5);
			});
		});

		describe('With block indicator', () => {
			it('Tabs Only, no extra space', () => {
				const test = '			aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(5);
			});

			it('Spaces only, no extra space', () => {
				const test = '      aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(8);
			});

			it('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			it('Tabs Only, with extra space', () => {
				const test = '			aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});

			it('Spaces only, with extra space', () => {
				const test = '      aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(9);
			});

			it('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(7);
			});
		});
	});

	describe('normalizeEntityName tests', () => {
		it('normalizes whitespace', () => {
			const base = '		two tabs';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual('  two tabs');
		});

		it('normalizes case', () => {
			const base = 'UpPeR AnD LoWeR CaSe';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual('upper and lower case');
		});

		it('normalizes both', () => {
			const base = '	UPPER and lower case';
			const normalized = normalizeEntityName(base);

			expect(normalized).toEqual(' upper and lower case');
		});
	});
});
