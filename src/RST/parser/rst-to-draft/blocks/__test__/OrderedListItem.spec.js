import OrderedListItem from '../OrderedListItem';
import Paragraph from '../Paragraph';
import Text from '../Text';

import {getInputInterface} from '../../../Parser';

describe('OrderedListItem', () => {
	describe('isNextBlock', () => {
		it('Matches Roman Numerals', () => {
			const tests = [
				'(IV) Ordered List Item',
				'XII. Ordered List Item',
				'XIV) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInputInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		it('Matches Alpha Numeric', () => {
			const tests = [
				'(B) Ordered List Item',
				'Z. Ordered List Item',
				'A) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInputInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		it('Matches Numeric', () => {
			const tests = [
				'(2) Ordered List Item',
				'11. Ordered List Item',
				'100) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInputInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		it('Matches Auto Numbered', () => {
			const tests = [
				'(#) Ordered List Item',
				'#. Ordered List Item',
				'#) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInputInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		it('Does not match non ordered list item', () => {
			const tests = [
				'A paragraph',
				'MCX paragraph',
				'# paragraph',
				'paragraph',
				'.. figure::http://www.google.com',
				'- bullet item'
			];

			for (let test of tests) {
				let inputInterface = getInputInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeFalsy();
			}
		});
	});


	describe('parse', () => {
		it('Parses text', () => {
			const rst = '1. Ordered List Item';
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.text.text).toEqual('Ordered List Item');
		});

		it('Parses Roman Numeral Link Style', () => {
			const rst = '(ii) Ordered List Item';
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('roman-numeral');
		});

		it('Parses Alpha Numeric Link Style', () => {
			const rst = 'a.) Ordered List Item';
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('alpha-numeric');
		});

		it('Parses Numeric Link Style', () => {
			const rst = '(1) Ordered List Item';
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('numeric');
		});

		it('Parses Auto Numbered Link Style', () => {
			const rst = '#) Ordered List Item';
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('auto-numbered');
		});
	});


	describe('Instance Tests', () => {
		it('Should append paragraphs that are the same offset', () => {
			const orderedListItem = new OrderedListItem('1. Ordered List Item', '1.');
			const paragraph = new Paragraph('   Paragraph', '', {text: new Text('Paragraph')});

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeTruthy();
		});


		it('Does not append paragraphs that are not the same offset', () => {
			const orderedListItem = new OrderedListItem('1. Ordered List Item', '1');
			const paragraph = new Paragraph('Paragraph', '', {text: new Text('Paragraph')});

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeFalsy();
		});

		it('Appending text adds it to the previous line', () => {
			const orderedListItem = new OrderedListItem('1. Ordered', '1', {text: new Text('Ordered')});
			const paragraph = new Paragraph('  List Item', '', {text: new Text('List Item')});

			orderedListItem.appendBlock(paragraph);

			expect(orderedListItem.parts.text.text).toEqual('Ordered List Item');
		});
	});
});
