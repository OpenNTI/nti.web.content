/* eslint-env jest */
import OrderedListItem from '../OrderedListItem';
import Paragraph from '../Paragraph';
import Text from '../Text';
import {getInterface} from '../../../Parser';

describe('OrderedListItem', () => {
	describe('isNextBlock', () => {
		test('Matches Roman Numerals', () => {
			const tests = [
				'(IV) Ordered List Item',
				'XII. Ordered List Item',
				'XIV) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		test('Matches Alpha Numeric', () => {
			const tests = [
				'(B) Ordered List Item',
				'Z. Ordered List Item',
				'A) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		test('Matches Numeric', () => {
			const tests = [
				'(2) Ordered List Item',
				'11. Ordered List Item',
				'100) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		test('Matches Auto Numbered', () => {
			const tests = [
				'(#) Ordered List Item',
				'#. Ordered List Item',
				'#) Ordered List Item'
			];

			for (let test of tests) {
				let inputInterface = getInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		test('Does not match non ordered list item', () => {
			const tests = [
				'A paragraph',
				'MCX paragraph',
				'# paragraph',
				'paragraph',
				'.. figure::http://www.google.com',
				'- bullet item'
			];

			for (let test of tests) {
				let inputInterface = getInterface(0, [test]);

				expect(OrderedListItem.isNextBlock(inputInterface)).toBeFalsy();
			}
		});
	});


	describe('parse', () => {
		test('Parses text', () => {
			const rst = '1. Ordered List Item';
			const inputInterface = getInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.text.text).toEqual('Ordered List Item');
		});

		test('Parses Roman Numeral Link Style', () => {
			const rst = '(ii) Ordered List Item';
			const inputInterface = getInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('roman-numeral');
		});

		test('Parses Alpha Numeric Link Style', () => {
			const rst = 'a.) Ordered List Item';
			const inputInterface = getInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('alpha-numeric');
		});

		test('Parses Numeric Link Style', () => {
			const rst = '(1) Ordered List Item';
			const inputInterface = getInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('numeric');
		});

		test('Parses Auto Numbered Link Style', () => {
			const rst = '#) Ordered List Item';
			const inputInterface = getInterface(0, [rst]);
			const {block} = OrderedListItem.parse(inputInterface);

			expect(block.listStyle).toEqual('auto-numbered');
		});
	});


	describe('Instance Tests', () => {
		test('Should append paragraphs that are the same offset', () => {
			const orderedListItem = new OrderedListItem('1. Ordered List Item', '1.');
			const paragraph = new Paragraph('   Paragraph', '', {text: new Text('Paragraph')});

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeTruthy();
		});


		test('Does not append paragraphs that are not the same offset', () => {
			const orderedListItem = new OrderedListItem('1. Ordered List Item', '1');
			const paragraph = new Paragraph('Paragraph', '', {text: new Text('Paragraph')});

			expect(orderedListItem.shouldAppendBlock(paragraph)).toBeFalsy();
		});

		test('Appending text adds it to the previous line', () => {
			const orderedListItem = new OrderedListItem('1. Ordered', '1', {text: new Text('Ordered')});
			const paragraph = new Paragraph('  List Item', '', {text: new Text('List Item')});

			orderedListItem.appendBlock(paragraph);

			expect(orderedListItem.parts.text.text).toEqual('Ordered List Item');
		});
	});
});
