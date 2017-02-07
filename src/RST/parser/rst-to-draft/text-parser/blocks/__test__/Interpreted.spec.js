import {INLINE_STYLE} from 'draft-js-utils';

import {getInterface} from '../../../../Parser';

import Interpreted from '../Interpreted';
import Plaintext from '../Plaintext';

describe('Interpreted', () => {
	describe('isNextBlock', () => {
		it('matchOpen is true for `', () => {
			const test = ['`', 'i', 'n', 't'];
			const inputInterface = getInterface(0, test);
			const {matches} = Interpreted.matchOpen(inputInterface);

			expect(matches).toBeTruthy();
		});

		it('matchOpen is not true for ``', () => {
			const test = ['`', '`', 'l', 'i', 't'];
			const inputInterface = getInterface(0, test);
			const {matches} = Interpreted.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchOpen is not true for not `', () => {
			const test = ['n', 'o', 't'];
			const inputInterface = getInterface(0, test);
			const {matches} = Interpreted.matchOpen(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchClose is true for `', () => {
			const test = ['`', 'a', 'f', 't', 'e', 'r'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = Interpreted.matchClose(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('a');
		});

		it('matchClose is false for ``', () => {
			const test = ['`', '`', 'a', 'f', 't', 'e', 'r'];
			const inputInterface = getInterface(0, test);
			const {matches} = Interpreted.matchClose(inputInterface);

			expect(matches).toBeFalsy();
		});

		it('matchClose consumes following _', () => {
			const test = ['`', '_', 'a', 'f', 't', 'e', 'r'];
			const inputInterface = getInterface(0, test);
			const {matches, nextChar} = Interpreted.matchClose(inputInterface);

			expect(matches).toBeTruthy();
			expect(nextChar).toEqual('a');
		});
	});

	describe('parse', () => {
		function buildBlock (type) {
			const block = {
				[type]: true,
				setMarkerFor: () => {}
			};

			spyOn(block, 'setMarkerFor');

			return block;
		}

		it('Calls setMarker if currentBlock is role', () => {
			const test = ['`'];
			const currentBlock = buildBlock('isRole');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Interpreted.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setMarkerFor).toHaveBeenCalledWith(block);
			expect(block.roleMarker).toEqual(currentBlock);
		});

		it('Calls setMarker if currentBlock is target', () => {
			const test = ['`'];
			const currentBlock = buildBlock('isTarget');
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, [currentBlock]);
			const {block} = Interpreted.parse(inputInterface, {}, parsedInterface);

			expect(currentBlock.setMarkerFor).toHaveBeenCalledWith(block);
			expect(block.roleMarker).toEqual(currentBlock);
		});
	});


	describe('getOutput', () => {
		function buildMarker () {
			const block = {
				getOutputForInterpreted: () => {}
			};

			spyOn(block, 'getOutputForInterpreted');

			return block;
		}

		it('If it has a marker, its getOutputForInterpreted', () => {
			const test = ['`'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);
			const marker = buildMarker();
			const context = {};
			const {block} = Interpreted.parse(inputInterface, context, parsedInterface);

			block.setRoleMarker(marker);
			block.getOutput(context);

			expect(marker.getOutputForInterpreted).toHaveBeenCalledWith(block, context);
		});

		it('If it has a marker, and output if forced', () => {
			const test = ['`'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);
			const marker = buildMarker();
			const context = {};
			const {block} = Interpreted.parse(inputInterface, context, parsedInterface);

			block.setRoleMarker(marker);
			block.getOutput(context, true);

			expect(marker.getOutputForInterpreted).not.toHaveBeenCalled();
		});

		it('Without marker code range output is returned', () => {
			const test = ['`'];
			const inputInterface = getInterface(0, test);
			const parsedInterface = getInterface(0, []);
			const {block} = Interpreted.parse(inputInterface, {}, parsedInterface);

			block.appendBlock(new Plaintext('i'));
			block.appendBlock(new Plaintext('n'));
			block.appendBlock(new Plaintext('t'));
			block.appendBlock(new Plaintext('e'));
			block.appendBlock(new Plaintext('r'));
			block.appendBlock(new Plaintext('p'));
			block.appendBlock(new Plaintext('r'));
			block.appendBlock(new Plaintext('e'));
			block.appendBlock(new Plaintext('t'));
			block.appendBlock(new Plaintext('e'));
			block.appendBlock(new Plaintext('d'));

			block.appendBlock(new Interpreted());

			const {output, context} = block.getOutput({charCount: 0});
			const {inlineStyleRanges, charCount} = context;

			expect(output).toEqual('interpreted');
			expect(charCount).toEqual(11);
			expect(inlineStyleRanges.length).toEqual(1);
			expect(inlineStyleRanges[0].style).toEqual(INLINE_STYLE.CODE);
			expect(inlineStyleRanges[0].offset).toEqual(0);
			expect(inlineStyleRanges[0].length).toEqual(11);
		});
	});
});
