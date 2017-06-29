/* eslint-env jest */
import RSTToDraftState from '../RSTToDraftState';

//TODO: Add directives, figures, and comments to the test RST and any
//other types we end up supporting
const TEST_RST = [
	'===================================',
	' This is a **test** `RST` Document',
	'===================================',
	'',
	'Inline Styles',
	'+++++++++++++',
	'',
	'The first paragraph doesn\'t have any styling',
	'',
	'The second paragraph has **bold**, *italic*, `interpreted`, and ``literals.``',
	'',
	'The third paragraph has roles :emphasis:`emphasis`, :math:`math`, :bolditalic:`bolditalic.`',
	'',
	'Links',
	'+++++',
	'',
	'Named Links',
	'-----------',
	'',
	'This paragraph has named links_ and even another `one with Multiple Words`_',
	'',
	'.. _links: http://www.google.com#links',
	'.. _one with multiple words: http://www.google.com#multiple',
	'',
	'Inline Links',
	'------------',
	'',
	'This paragraph has `inline links <http://www.google.com#inline>`_',
	'',
	'Bullet Lists',
	'++++++++++++',
	'',
	'- List Item 1 with *italic*',
	'  - Nested List Item with **bold**',
	'    - Double Nested List Item',
	'- List Item 2 with ``literal``',
	'',
	'Ordered Lists',
	'+++++++++++++',
	'',
	'1. Numbered List Item with *italic*',
	'  1. Numbered Nested List Item',
	'2. Numbered List Item',
	'',
	'A) Alpha List Item with **bold**',
	'  a) Alpha Nested List Item',
	'B) Alpha List Item',
	'',
	'(I) Roman Numeral List Item with `interpreted`',
	'  (i) Roman Numeral Nested List Item',
	'(II) Roman Numeral List Item'
].join('\n');

const TEST_PARSED = RSTToDraftState.parse(TEST_RST);
const {blocks, entityMap} = TEST_PARSED;

describe('RSTToDraftState', () => {
	test('Has the correct number of blocks', () => {
		expect(blocks.length).toEqual(25);
	});

	test('entityMap has all the entities', () => {
		const links = entityMap['links'];
		const multiple = entityMap['one with multiple words'];
		const inline = entityMap[3];//The id of inline links is now based on a counter of how many links we've parsed

		expect(Object.keys(entityMap).length).toEqual(3);

		expect(links.type).toEqual('LINK');
		expect(links.mutability).toEqual('MUTABLE');
		expect(links.data.name).toEqual('links');
		expect(links.data.href).toEqual('http://www.google.com#links');

		expect(multiple.type).toEqual('LINK');
		expect(multiple.mutability).toEqual('MUTABLE');
		expect(multiple.data.name).toEqual('one with multiple words');
		expect(multiple.data.href).toEqual('http://www.google.com#multiple');

		expect(inline.type).toEqual('LINK');
		expect(inline.mutability).toEqual('MUTABLE');
		expect(inline.data.name).toEqual('inline links');
		expect(inline.data.href).toEqual('http://www.google.com#inline');
	});

	describe('Headers', () => {
		test('Title', () => {
			const header = blocks[0];

			expect(header.type).toEqual('header-one');
			expect(header.text).toEqual('This is a test RST Document');
		});

		test('Inline Styles', () => {
			const header = blocks[1];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Inline Styles');
		});

		test('Links', () => {
			const header = blocks[5];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Links');
		});

		test('Named Links', () => {
			const header = blocks[6];

			expect(header.type).toEqual('header-three');
			expect(header.text).toEqual('Named Links');
		});

		test('Inline Links', () => {
			const header = blocks[8];

			expect(header.type).toEqual('header-three');
			expect(header.text).toEqual('Inline Links');
		});

		test('Bullet Lists', () => {
			const header = blocks[10];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Bullet Lists');
		});

		test('Ordered List', () => {
			const header = blocks[15];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Ordered Lists');
		});
	});

	describe('Paragraphs', () => {
		test('First Paragraph', () => {
			const block = blocks[2];

			expect(block.type).toEqual('unstyled');
			expect(block.text).toEqual('The first paragraph doesn\'t have any styling');
		});

		test('Second Paragraph', () => {
			const block = blocks[3];

			expect(block.type).toEqual('unstyled');
			expect(block.text).toEqual('The second paragraph has bold, italic, interpreted, and literals.');
		});

		test('Third Paragraph', () => {
			const block = blocks[4];

			expect(block.type).toEqual('unstyled');
			expect(block.text).toEqual('The third paragraph has roles emphasis, math, bolditalic.');
		});

		test('Named Links Paragraph', () => {
			const block = blocks[7];

			expect(block.type).toEqual('unstyled');
			expect(block.text).toEqual('This paragraph has named links and even another one with Multiple Words');
		});

		test('Inline Links Paragraph', () => {
			const block = blocks[9];

			expect(block.type).toEqual('unstyled');
			expect(block.text).toEqual('This paragraph has inline links');
		});
	});

	describe('Bullets', () => {
		test('List Item 1', () => {
			const block = blocks[11];

			expect(block.type).toEqual('unordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.text).toEqual('List Item 1 with italic');
		});

		test('Nested List Item', () => {
			const block = blocks[12];

			expect(block.type).toEqual('unordered-list-item');
			expect(block.depth).toEqual(1);
			expect(block.text).toEqual('Nested List Item with bold');
		});

		test('Double Nested List Item', () => {
			const block = blocks[13];

			expect(block.type).toEqual('unordered-list-item');
			expect(block.depth).toEqual(2);
			expect(block.text).toEqual('Double Nested List Item');
		});

		test('List Item 2', () => {
			const block = blocks[14];

			expect(block.type).toEqual('unordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.text).toEqual('List Item 2 with literal');
		});
	});

	describe('Ordered List Items', () => {
		test('Numbered List Item 1', () => {
			const block = blocks[16];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('numeric');
			expect(block.text).toEqual('Numbered List Item with italic');
		});

		test('Numbered Nested List Item', () => {
			const block = blocks[17];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(1);
			expect(block.data.listStyle).toEqual('numeric');
			expect(block.text).toEqual('Numbered Nested List Item');
		});

		test('Numbered List Item 2', () => {
			const block = blocks[18];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('numeric');
			expect(block.text).toEqual('Numbered List Item');
		});

		test('Alpha List Item 1', () => {
			const block = blocks[19];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('alpha-numeric');
			expect(block.text).toEqual('Alpha List Item with bold');
		});

		test('Alpha Nested List Item', () => {
			const block = blocks[20];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(1);
			expect(block.data.listStyle).toEqual('alpha-numeric');
			expect(block.text).toEqual('Alpha Nested List Item');
		});

		test('Alpha List Item 2', () => {
			const block = blocks[21];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('alpha-numeric');
			expect(block.text).toEqual('Alpha List Item');
		});

		test('Roman Numeral List Item 1', () => {
			const block = blocks[22];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('roman-numeral');
			expect(block.text).toEqual('Roman Numeral List Item with interpreted');
		});

		test('Roman Numeral Nested List Item', () => {
			const block = blocks[23];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(1);
			expect(block.data.listStyle).toEqual('roman-numeral');
			expect(block.text).toEqual('Roman Numeral Nested List Item');
		});

		test('Roman Numeral List Item 2', () => {
			const block = blocks[24];

			expect(block.type).toEqual('ordered-list-item');
			expect(block.depth).toEqual(0);
			expect(block.data.listStyle).toEqual('roman-numeral');
			expect(block.text).toEqual('Roman Numeral List Item');
		});
	});

	describe('Inline Styles', () => {
		test('Title', () => {
			const block = blocks[0];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(2);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(10);
			expect(inlineStyleRanges[0].length).toEqual(4);

			expect(inlineStyleRanges[1].style).toEqual('CODE');
			expect(inlineStyleRanges[1].offset).toEqual(15);
			expect(inlineStyleRanges[1].length).toEqual(3);
		});

		test('Second Paragraph', () => {
			const block = blocks[3];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(4);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(25);
			expect(inlineStyleRanges[0].length).toEqual(4);

			expect(inlineStyleRanges[1].style).toEqual('ITALIC');
			expect(inlineStyleRanges[1].offset).toEqual(31);
			expect(inlineStyleRanges[1].length).toEqual(6);

			expect(inlineStyleRanges[2].style).toEqual('CODE');
			expect(inlineStyleRanges[2].offset).toEqual(39);
			expect(inlineStyleRanges[2].length).toEqual(11);

			expect(inlineStyleRanges[3].style).toEqual('CODE');
			expect(inlineStyleRanges[3].offset).toEqual(56);
			expect(inlineStyleRanges[3].length).toEqual(9);
		});

		test('Bullet list Item 1', () => {
			const block = blocks[11];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('ITALIC');
			expect(inlineStyleRanges[0].offset).toEqual(17);
			expect(inlineStyleRanges[0].length).toEqual(6);
		});

		test('Nested Bullet List Item', () => {
			const block = blocks[12];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(22);
			expect(inlineStyleRanges[0].length).toEqual(4);
		});

		test('Bullet list Item 2', () => {
			const block = blocks[14];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('CODE');
			expect(inlineStyleRanges[0].offset).toEqual(17);
			expect(inlineStyleRanges[0].length).toEqual(7);
		});

		test('Ordered List Item 1', () => {
			const block = blocks[16];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('ITALIC');
			expect(inlineStyleRanges[0].offset).toEqual(24);
			expect(inlineStyleRanges[0].length).toEqual(6);
		});

		test('Ordered List Item 3', () => {
			const block = blocks[19];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(21);
			expect(inlineStyleRanges[0].length).toEqual(4);
		});

		test('Ordered List Item 5', () => {
			const block = blocks[22];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('CODE');
			expect(inlineStyleRanges[0].offset).toEqual(29);
			expect(inlineStyleRanges[0].length).toEqual(11);
		});
	});

	describe('Entity Ranges', () => {
		test('Named Links', () => {
			const block = blocks[7];
			const {entityRanges} = block;

			expect(entityRanges.length).toEqual(2);

			expect(entityRanges[0].key).toEqual('links');
			expect(entityRanges[0].offset).toEqual(25);
			expect(entityRanges[0].length).toEqual(5);

			expect(entityRanges[1].key).toEqual('one with multiple words');
			expect(entityRanges[1].offset).toEqual(48);
			expect(entityRanges[1].length).toEqual(23);
		});

		test('Inline Links', () => {
			const block = blocks[9];
			const {entityRanges} = block;

			expect(entityRanges.length).toEqual(1);

			expect(entityRanges[0].key).toEqual(3);//The key for inline links is based on a counter
			expect(entityRanges[0].offset).toEqual(19);
			expect(entityRanges[0].length).toEqual(12);
		});
	});
});
