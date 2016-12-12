import {getIndention} from '../utils';

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
				expect(indention.lineOffset).toEqual(3);
			});

			it('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(3);
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
				expect(indention.lineOffset).toEqual(4);
			});

			it('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	 block with blockOffset';
				const indention = getIndention(test);

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(4);
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
				expect(indention.lineOffset).toEqual(5);
			});

			it('Mixed tabs and spaces, no extra space', () => {
				const test = '	  	aablock with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(5);
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
				expect(indention.lineOffset).toEqual(6);
			});

			it('Mixed tabs and spaces, with extra space', () => {
				const test = '	  	aa block with blockOffset';
				const indention = getIndention(test, 'aa');

				expect(indention.blockOffset).toEqual(3);
				expect(indention.lineOffset).toEqual(6);
			});
		});
	});
});
