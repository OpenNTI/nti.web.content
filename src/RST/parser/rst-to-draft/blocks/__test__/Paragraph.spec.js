/* eslint-env jest */
import {BLOCK_TYPE} from 'draft-js-utils';

import Paragraph from '../Paragraph';
import {getInterface} from '../../../Parser';

describe('Paragraph', () => {
	test('isNextBlock matches everything', () => {
		const tests = [
			'paragraph',
			'  paragraph',
			'.. paragraph'
		];

		for (let test of tests) {
			let inputInterface = getInterface(0, [test]);

			expect(Paragraph.isNextBlock(inputInterface)).toBeTruthy();
		}
	});

	test('parses ignore leading spaces (that just makes it a block quote)', () => {
		const text = ' paragraph';
		const inputInterface = getInterface(0, [text]);
		const {block} = Paragraph.parse(inputInterface);

		expect(block.text.text).toEqual('paragraph');
	});

	describe('Instance', () => {
		test('Indented paragraphs are output as block quotes', () => {
			const text = '  paragraph';
			const inputInterface = getInterface(0, [text]);
			const {block} = Paragraph.parse(inputInterface);
			const {output} = block.getOutput({});

			expect(output.type).toEqual(BLOCK_TYPE.BLOCKQUOTE);
		});
	});
});
