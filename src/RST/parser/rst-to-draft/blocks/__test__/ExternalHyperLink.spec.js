import ExternalHyperLink from '../ExternalHyperLink';

import {normalizeEntityName} from '../../utils';

import {getInputInterface} from '../../../Parser';

describe('External HyperLink', () => {
	describe('isNextBlock', () => {
		it('Matches ExternalHyperLink', () => {
			const rst = '.. _link name: http://www.google.com';
			const inputInterface = getInputInterface(0, [rst]);

			expect(ExternalHyperLink.isNextBlock(inputInterface)).toBeTruthy();
		});

		it('Does not match non ExternalHyperLinks', () => {
			const rst = 'this is a paragraph';
			const inputInterface = getInputInterface(0, [rst]);

			expect(ExternalHyperLink.isNextBlock(inputInterface)).toBeFalsy();
		});
	});

	describe('parsing', () => {
		it('Parses name', () => {
			const name = 'external link';
			const rst = `.. _${name}: http://www.google.com`;
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = ExternalHyperLink.parse(inputInterface);

			expect(block.name).toEqual(name);
		});

		it('Parses target with space', () => {
			const link = 'http://www.google.com';
			const rst = `.. _external link: ${link}`;
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = ExternalHyperLink.parse(inputInterface);

			expect(block.target).toEqual(link);
		});

		it('Parses target without space', () => {
			const link = 'http://www.google.com';
			const rst = `.. _external link:${link}`;
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = ExternalHyperLink.parse(inputInterface);

			expect(block.target).toEqual(link);
		});
	});

	describe('Instance Tests', () => {
		const name = 'Test Link Name';
		const target = 'http://www.google.com';
		let link;

		beforeEach(() => {
			const rst = `.. _${name}: ${target}`;
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = ExternalHyperLink.parse(inputInterface);

			link = block;
		});

		it('Adds correct link to the entity map', () => {
			const context = {};

			link.getOutput(context);

			const entity = context.entityMap[normalizeEntityName(name)];

			expect(entity).toBeTruthy();
			expect(entity.data).toBeTruthy();
			expect(entity.data.name).toEqual(name);
			expect(entity.data.url).toEqual(target);
		});
	});
});
