/* eslint-env jest */
import Directive from '../Directive';
import Paragraph from '../Paragraph';
import Empty from '../Empty';
import FieldList from '../FieldList';
import {getInterface} from '../../../Parser';


describe('Generic Directive', () => {
	describe('isNextBlock', () => {
		test('Matches on a directive', () => {
			const rst = '.. directive:: argument1 argument 2';
			const inputInterface = getInterface(0, [rst]);

			expect(Directive.isNextBlock(inputInterface, {})).toBeTruthy();
		});

		test('Does not match on non directives', () => {
			const rst = '- bullet list item';
			const inputInterface = getInterface(0, [rst]);

			expect(Directive.isNextBlock(inputInterface, {})).toBeFalsy();
		});
	});

	describe('parsing', () => {
		test('Parses name', () => {
			const name = 'directive';
			const rst = `.. ${name}:: argument1 argument 2`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = Directive.parse(inputInterface, {});

			expect(block.name).toEqual(name);
		});

		test('Parses arguments', () => {
			const args = 'argument1 argument2';
			const rst = `.. directive:: ${args}`;
			const inputInterface = getInterface(0, [rst]);
			const {block} = Directive.parse(inputInterface, {});

			expect(block.arguments).toEqual(args);
		});
	});


	describe('Instance tests', () => {
		let directive;

		beforeEach(() => {
			const rst = '.. directive:: argument1 argument2';
			const inputInterface = getInterface(0, [rst]);
			const {block} = Directive.parse(inputInterface, {});

			directive = block;
		});

		describe('shouldAppendBlock', () => {

			test('Should append deeper blocks', () => {
				const paragraph = new Paragraph('  indented paragraph', '', {text: 'indented paragraph'});

				expect(directive.shouldAppendBlock(paragraph)).toBeTruthy();
			});

			test('Should append empty blocks', () => {
				const empty = new Empty();

				expect(directive.shouldAppendBlock(empty)).toBeTruthy();
			});

			test('Should not append blocks that are the same depth', () => {
				const paragraph = new Paragraph('not indented paragraph', '', {text: 'indented paragraph'});

				expect(directive.shouldAppendBlock(paragraph)).toBeFalsy();
			});
		});

		describe('appendBlock', () => {
			test('Field Lists are added to the options', () => {
				const name = 'name';
				const value = 'value';
				const fieldList = new FieldList('  :name: value', '', {name, value});

				directive.appendBlock(fieldList);

				expect(directive.options[name]).toEqual(value);
			});

			test('Non empty blocks are appended to the body', () => {
				const first = new Paragraph('  paragraph 1', '', {test: 'paragraph 1'});
				const second = new Paragraph('  paragraph 2', '', {test: 'paragraph 2'});

				directive.appendBlock(first);
				directive.appendBlock(second);

				expect(directive.body[0]).toEqual(first);
				expect(directive.body[1]).toEqual(second);
			});
		});
	});
});
