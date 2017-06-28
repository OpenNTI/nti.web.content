/* eslint-env jest */
import TextParser from '../TextParser';
import {normalizeEntityName} from '../../utils';

describe('TextParser', () => {
	const test1 = 'no markup in this string';
	test(test1, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test1);

		expect(text).toEqual(test1);
		expect(inlineStyleRanges.length).toEqual(0);
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
	});

	const test2 = '*entire text is emphasis*';
	test(test2, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test2);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('entire text is emphasis');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('ITALIC');
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(23);
	});

	const test3 = 'last half **is strong emphasis**';
	test(test3, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test3);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('last half is strong emphasis');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('BOLD');
		expect(range.offset).toEqual(10);
		expect(range.length).toEqual(18);
	});

	const test4 = '`entire text is inline-link <http://www.google.com>`_';
	test(test4, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test4);
		const range = entityRanges[0];
		const entity = entityMap[range.key];

		expect(text).toEqual('entire text is inline-link');
		expect(inlineStyleRanges.length).toEqual(0);
		expect(entityRanges.length).toEqual(1);
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(26);
		expect(entity.type).toEqual('LINK');
		expect(entity.mutability).toEqual('MUTABLE');
		expect(entity.data.href).toEqual('http://www.google.com');
		expect(entity.data.name).toEqual('entire text is inline-link');
	});

	const test5 = 'text has a named link_';
	test(test5, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test5);
		const range = entityRanges[0];

		expect(text).toEqual('text has a named link');
		expect(inlineStyleRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(entityRanges.length).toEqual(1);
		expect(range.key).toEqual(normalizeEntityName('link'));
		expect(range.offset).toEqual(17);
		expect(range.length).toEqual(4);
	});

	const test6 = 'emphasis role works :emphasis:`on this`';
	test(test6, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test6);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('emphasis role works on this');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('ITALIC');
		expect(range.offset).toEqual(20);
		expect(range.length).toEqual(7);
	});

	const test7 = '**x*x**';
	test(test7, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test7);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('x*x');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('BOLD');
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(3);
	});

	const test8 = ':emphasis:`,interpreted with escaped first char`';
	test(test8, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test8);
		const range = inlineStyleRanges[0];

		expect(text).toEqual(',interpreted with escaped first char');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('ITALIC');
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(36);
	});

	const test9 = '*\\**';
	test(test9, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test9);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('*');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('ITALIC');
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(1);
	});

	const test10 = '**\\***';
	test(test10, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test10);
		const range = inlineStyleRanges[0];

		expect(text).toEqual('*');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(1);
		expect(range.style).toEqual('BOLD');
		expect(range.offset).toEqual(0);
		expect(range.length).toEqual(1);
	});

	const test11 = ':strong:`strong`:math:`math`';
	test(test11, () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = TextParser.parse(test11);

		expect(text).toEqual('strongmath');
		expect(entityRanges.length).toEqual(0);
		expect(Object.keys(entityMap).length).toEqual(0);
		expect(inlineStyleRanges.length).toEqual(2);
		expect(inlineStyleRanges[0].style).toEqual('BOLD');
		expect(inlineStyleRanges[0].offset).toEqual(0);
		expect(inlineStyleRanges[0].length).toEqual(6);
		expect(inlineStyleRanges[1].style).toEqual('CODE');
		expect(inlineStyleRanges[1].offset).toEqual(6);
		expect(inlineStyleRanges[1].length).toEqual(4);
	});
});
