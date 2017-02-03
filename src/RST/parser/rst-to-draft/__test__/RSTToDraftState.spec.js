import RSTToDraftState from '../RSTToDraftState';

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
	'This paragraph has named links_ and even another `one with multiple words`_',
	'',
	'.. _link: http://www.google.com',
	'.. _one with multiple words: http://www.google.com',
	'',
	'Inline Links',
	'------------',
	'',
	'This paragraph has `inline links <http://www.google.com>`_',
	'',
	'Bullet Lists',
	'++++++++++++',
	'',
	'- List Item 1 with *italic*',
	'    - Nested List Item with **bold**',
	'      - Double Nested List Item',
	'- List Item 2 with ``literal``',
	'',
	'Ordered Lists',
	'+++++++++++++',
	'',
	'1. Numbered List Item with *italic*',
	'2. Numbered List Item',
	'',
	'A) Alpha List Item with **bold**',
	'B) Alpha List item',
	'',
	'(i) Roman Numeral List Item with `interpreted`',
	'(ii) Roman Numeral List Item'
].join('\n');

const TEST_PARSED = RSTToDraftState.parse(TEST_RST);
const {blocks} = TEST_PARSED;

fdescribe('RSTToDraftState', () => {
	it('Has the correct number of blocks', () => {
		expect(blocks.length).toEqual(22);
	});

	describe('Headers', () => {
		it('Title', () => {
			const header = blocks[0];

			expect(header.type).toEqual('header-one');
			expect(header.text).toEqual('This is a test RST Document');
		});

		it('Inline Styles', () => {
			const header = blocks[1];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Inline Styles');
		});

		it('Links', () => {
			const header = blocks[5];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Links');
		});

		it('Named Links', () => {
			const header = blocks[6];

			expect(header.type).toEqual('header-three');
			expect(header.text).toEqual('Named Links');
		});

		it('Inline Links', () => {
			const header = blocks[8];

			expect(header.type).toEqual('header-three');
			expect(header.text).toEqual('Inline Links');
		});

		it('Bullet Lists', () => {
			const header = blocks[10];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Bullet Lists');
		});

		it('Ordered List', () => {
			const header = blocks[15];

			expect(header.type).toEqual('header-two');
			expect(header.text).toEqual('Ordered Lists');
		});
	});

	describe('Inline Styles', () => {
		it('Title', () => {
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

		it('Second Paragraph', () => {
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

		it('Bullet list Item 1', () => {
			const block = blocks[11];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('ITALIC');
			expect(inlineStyleRanges[0].offset).toEqual(17);
			expect(inlineStyleRanges[0].length).toEqual(6);
		});

		it('Nested Bullet List Item', () => {
			const block = blocks[12];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(22);
			expect(inlineStyleRanges[0].length).toEqual(4);
		});

		it('Bullet list Item 2', () => {
			const block = blocks[14];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('CODE');
			expect(inlineStyleRanges[0].offset).toEqual(17);
			expect(inlineStyleRanges[0].length).toEqual(7);
		});

		it('Ordered List Item 1', () => {
			const block = blocks[16];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('ITALIC');
			expect(inlineStyleRanges[0].offset).toEqual(24);
			expect(inlineStyleRanges[0].length).toEqual(6);
		});

		it('Ordered List Item 3', () => {
			const block = blocks[18];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('BOLD');
			expect(inlineStyleRanges[0].offset).toEqual(21);
			expect(inlineStyleRanges[0].length).toEqual(4);
		});

		it('Ordered List Item 5', () => {
			const block = blocks[20];
			const {inlineStyleRanges} = block;

			expect(inlineStyleRanges.length).toEqual(1);

			expect(inlineStyleRanges[0].style).toEqual('CODE');
			expect(inlineStyleRanges[0].offset).toEqual(29);
			expect(inlineStyleRanges[0].length).toEqual(11);
		});
	});
});
