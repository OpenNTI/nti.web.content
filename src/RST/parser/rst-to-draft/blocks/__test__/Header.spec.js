import Header, {LEVEL_TO_TYPE} from '../Header';
import Paragraph from '../Paragraph';
import Text from '../Text';

import {getInputInterface} from '../../../Parser';

fdescribe('Header', () => {
	describe('isNextBlock', () => {
		it('Matches headers', () => {
			const chars = ['=', '-', '`', ':', '.', '\'', '"', '~', '^', '_', '*', '+', '#'];

			for (let char of chars) {
				let rst = `${char}${char}${char}`;
				let inputInterface = getInputInterface(0, [rst]);

				expect(Header.isNextBlock(inputInterface)).toBeTruthy();
			}
		});

		it('Does not match non headers', () => {
			const rst = 'paragraph';
			const inputInterface = getInputInterface(0, [rst]);

			expect(Header.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
		it('Hitting a different header character while a header is open throws an error', () => {
			const rst = '====';
			const inputInterface = getInputInterface(0, [rst]);
			const context = {openHeader: '-'};

			try {
				Header.parse(inputInterface, context);
				expect('Did not throw error').toEqual('Did throw error');
			} catch (e) {
				expect('Did throw error').toEqual('Did throw error');
			}
		});

		it('Seeing the same header more than once keeps the same level', () => {
			const rst = '===';
			const inputInterface = getInputInterface(0, [rst]);
			const {context} = Header.parse(inputInterface, {});

			expect(context.headerLevels.charToLevel['=']).toEqual(1);

			const {context:newContext} = Header.parse(inputInterface, context);

			expect(newContext.headerLevels.charToLevel['=']).toEqual(1);
		});

		it('Increases depth with new characters until it reaches 6', () => {
			const chars = ['=', '-', ':', '.', '^', '_', '*', '+', '#'];
			let context = {};

			for (let char of chars) {
				let rst = `${char}${char}${char}`;
				let inputInterface = getInputInterface(0, [rst]);
				let {context:newContext} = Header.parse(inputInterface, context);

				//Close the header for the purposes of this test
				delete newContext.openHeader;
				context = newContext;
			}

			expect(context.headerLevels.charToLevel['=']).toEqual(1);
			expect(context.headerLevels.charToLevel['-']).toEqual(2);
			expect(context.headerLevels.charToLevel[':']).toEqual(3);
			expect(context.headerLevels.charToLevel['.']).toEqual(4);
			expect(context.headerLevels.charToLevel['^']).toEqual(5);
			expect(context.headerLevels.charToLevel['_']).toEqual(6);
			expect(context.headerLevels.charToLevel['*']).toEqual(6);
			expect(context.headerLevels.charToLevel['+']).toEqual(6);
			expect(context.headerLevels.charToLevel['#']).toEqual(6);
		});

		it('No currentBlock just marks a header open, does not return a block', () => {
			const rst = '===';
			const inputInterface = getInputInterface(0, [rst]);
			const {block, context} = Header.parse(inputInterface, {});

			expect(block).toBeFalsy();
			expect(context.openHeader).toBeTruthy();
		});

		it('When currentBlock is a paragraph, it gets consumed, and a header block is returned', () => {
			const rst = '===';
			const inputInterface = getInputInterface(0, [rst]);
			const paragraph = new Paragraph('paragraph', '', {});
			const {block, context} = Header.parse(inputInterface, {openHeader: '='}, paragraph);

			expect(block).toBeTruthy();
			expect(context.openHeader).toBeFalsy();
			expect(paragraph.isConsumed).toBeTruthy();
		});
	});

	describe('Instance Tests', () => {
		it('Returns the correct type for the level', () => {
			const textBlock = new Paragraph('paragraph', '', {text: new Text('paragraph')});

			for (let i = 0; i <= 6; i++) {
				let block = new Header('++++', {level: i, char: '+', textBlock});
				let {output} = block.getOutput({});

				expect(output.type).toEqual(LEVEL_TO_TYPE[i]);
			}
		});

		it('Returns the correct text', () => {
			const text = 'paragraph';
			const textBlock = new Paragraph(text, '', {text: new Text(text)});
			const block = new Header('+++', {level: 1, char: '+', textBlock});
			const {output} = block.getOutput({});

			expect(output.text).toEqual(text);
		});
	});
});
