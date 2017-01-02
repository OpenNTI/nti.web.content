import Header, {LEVEL_TO_TYPE} from '../Header';
import Paragraph from '../Paragraph';
import Text from '../Text';

import {getInputInterface} from '../../../Parser';

fdescribe('Header', () => {
	describe('isValidOverlined', () => {
		it('No currentBlock, and a valid underline', () => {
			const input = [
				'===',
				'asd',
				'==='
			];
			const inputInterface = getInputInterface(0, input);

			expect(Header.isValidOverlined(inputInterface, {}, null)).toBeTruthy();
		});

		it('No currentBlock, and underline is too short', () => {
			const input = [
				'===',
				'asd',
				'=='
			];
			const inputInterface = getInputInterface(0, input);

			expect(Header.isValidOverlined(inputInterface, {}, null)).toBeFalsy();
		});

		it('Non-paragraph currentBlock, and the the overline is too short for the text', () => {
			const input = [
				'==',
				'asd',
				'=='
			];
			const inputInterface = getInputInterface(0, input);

			expect(Header.isValidOverlined(inputInterface, {}, {isParagraph: false})).toBeFalsy();
		});
	});


	describe('isValidUnderline', () => {
		it('One line paragraph, no open header, right length', () => {
			const input = [
				'asd',
				'==='
			];
			const inputInterface = getInputInterface(1, input);

			expect(Header.isValidUnderlined(inputInterface, {}, {isParagraph: true, isOneLine: true})).toBeTruthy();
		});

		it('Current header with the incorrect char', () => {
			const input = [
				'asd',
				'==='
			];
			const inputInterface = getInputInterface(1, input);

			expect(Header.isValidUnderlined(inputInterface, {openHeader: '+'}, {isParagraph: true, isOneLine: true})).toBeFalsy();
		});
	});

	describe('isValidHeader', () => {
		it('Matches Headers', () => {
			const chars = ['=', '-', '`', ':', '.', '\'', '"', '~', '^', '_', '*', '+', '#'];

			for (let char of chars) {
				let rst = `${char}${char}${char}`;
				let inputInterface = getInputInterface(0, [rst]);

				expect(Header.isValidHeader(inputInterface)).toBeTruthy();
			}
		});

		it('Does not match non headers', () => {
			const rst = 'paragraph';
			const inputInterface = getInputInterface(0, [rst]);

			expect(Header.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parse', () => {
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
				let block = new Header('++++', '', {level: i, char: '+', textBlock});
				let {output} = block.getOutput({});

				expect(output.type).toEqual(LEVEL_TO_TYPE[i]);
			}
		});

		it('Returns the correct text', () => {
			const text = 'paragraph';
			const textBlock = new Paragraph(text, '', {text: new Text(text)});
			const block = new Header('+++', '', {level: 1, char: '+', textBlock});
			const {output} = block.getOutput({});

			expect(output.text).toEqual(text);
		});
	});
});
