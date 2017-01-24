import UnorderedListItem from '../UnorderedListItem';
import Paragraph from '../Paragraph';
import Text from '../Text';

import {getInputInterface} from '../../../Parser';

fdescribe('Unordered List Item', () => {
	describe('isNextBlock', () => {
		it('Matches Unordered List Item depth 0', () => {
			const test = '- unordered list item';
			const inputInterface = getInputInterface(0, [test]);

			expect(UnorderedListItem.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Matches Unordered List Item depth 1', () => {
			const test = '	- nested unordered list item';
			const inputInterface = getInputInterface(0, [test]);

			expect(UnorderedListItem.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Does not match non unordered list item', () => {
			const test = 'not an unordered list item';
			const inputInterface = getInputInterface(0, [test]);

			expect(UnorderedListItem.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('Parsing', () => {
		it('Parses Test', () => {
			const test = 'unordered list item';
			const inputInterface = getInputInterface(0, [`- ${test}`]);
			const {block} = UnorderedListItem.parse(inputInterface);

			expect(block.text.text).toEqual(test);
		});


		it('Parses Depth', () => {
			const tests = [
				'- nested',
				'	- nested',
				'		- nested',
				'			- nested',
				'				- nested',
				'					- nested'
			];

			for (let i = 0; i < tests.length; i++) {
				let test = tests[i];
				let inputInterface = getInputInterface(0, [test]);
				let {block} = UnorderedListItem.parse(inputInterface);

				expect(block.depth).toEqual(i);
			}
		});
	});

	describe('Instance Tests', () => {
		it('Should append paragraphs that are the same offset', () => {
			const orderedListItem = new UnorderedListItem('- Unordered List Item', '-');
			const paragraph = new Paragraph('  Paragraph');

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeTruthy();
		});


		it('Does not append paragraphs that are not the same offset', () => {
			const orderedListItem = new UnorderedListItem('- Unordered List Item', '-');
			const paragraph = new Paragraph('Paragraph');

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeFalsy();
		});

		it('Appending text adds it to the previous line', () => {
			const orderedListItem = new UnorderedListItem('- Unordered', '-', {text: new Text('Unordered')});
			const paragraph = new Paragraph('  List Item');

			orderedListItem.appendBlock(paragraph);

			expect(orderedListItem.parts.text.text).toEqual('Unordered List Item');
		});
	});
});
