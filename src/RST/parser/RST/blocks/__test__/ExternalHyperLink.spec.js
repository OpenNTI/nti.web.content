import ExternalHyperLink from '../ExternalHyperLink';

import {normalizeEntityName} from '../../utils';

import {getInputInterface} from '../../../Parser';

fdescribe('External HyperLink', () => {
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

		it('Parses target', () => {
			const link = 'http://www.google.com';
			const rst = `.. _external link: ${link}`;
			const inputInterface = getInputInterface(0, [rst]);
			const {block} = ExternalHyperLink.parse(inputInterface);

			expect(block.target).toEqual(link);
		});
	});

	//TODO: test that it puts the correct entity in the entityMap
});
