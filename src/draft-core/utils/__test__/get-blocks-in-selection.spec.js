import {convertFromRaw, SelectionState} from 'draft-js';

import {BLOCKS} from '../../Constants';
import getBlocksInSelection from '../get-blocks-in-selection';

function createBlock (text, type = BLOCKS.UNSTYLED) {
	return {type, text, depth: 0, inlineStyleRanges: [], entityRanges: []};
}

function createSelection (anchorKey, focusKey) {
	return new SelectionState({
		anchorKey,
		focusKey,
		anchorOffset: 0,
		focusOffset: 0
	});
}


describe('getBlocksInSelection', () => {
	let content;
	let keys;

	const getBlocks = (start, end) => getBlocksInSelection(content, createSelection(start, end));

	beforeEach(() => {
		content = convertFromRaw({
			blocks: [
				createBlock('Block 1'),
				createBlock('Block 2'),
				createBlock('Block 3'),
				createBlock('Block 4')
			],
			entityMap: {}
		});

		keys = content.getBlocksAsArray().map(x => x.getKey());
	});

	describe('Single Block Selection', () => {
		it('First Block Selected', () => {
			const blocks = getBlocks(keys[0], keys[0]);

			expect(blocks.length).toEqual(1);
			expect(blocks[0].getKey()).toEqual(keys[0]);
		});

		it('Middle Block Selected', () => {
			const blocks = getBlocks(keys[1], keys[1]);

			expect(blocks.length).toEqual(1);
			expect(blocks[0].getKey()).toEqual(keys[1]);
		});

		it('Last Block Selected', () => {
			const blocks = getBlocks(keys[2], keys[2]);

			expect(blocks.length).toEqual(1);
			expect(blocks[0].getKey()).toEqual(keys[2]);
		});
	});

	describe('Multi-Block Selection', () => {
		it('First Two Blocks Selected', () => {
			const blocks = getBlocks(keys[0], keys[1]);

			expect(blocks.length).toEqual(2);
			expect(blocks[0].getKey()).toEqual(keys[0]);
			expect(blocks[1].getKey()).toEqual(keys[1]);
		});

		it('Middle Two Blocks Selected', () => {
			const blocks = getBlocks(keys[1], keys[2]);

			expect(blocks.length).toEqual(2);
			expect(blocks[0].getKey()).toEqual(keys[1]);
			expect(blocks[1].getKey()).toEqual(keys[2]);
		});

		it('Last Two Blocks Selected', () => {
			const blocks = getBlocks(keys[2], keys[3]);

			expect(blocks.length).toEqual(2);
			expect(blocks[0].getKey()).toEqual(keys[2]);
			expect(blocks[1].getKey()).toEqual(keys[3]);
		});

		it('First Three Blocks Selected', () => {
			const blocks = getBlocks(keys[0], keys[2]);

			expect(blocks.length).toEqual(3);
			expect(blocks[0].getKey()).toEqual(keys[0]);
			expect(blocks[1].getKey()).toEqual(keys[1]);
			expect(blocks[2].getKey()).toEqual(keys[2]);
		});

		it('Last Three Blocks Selected', () => {
			const blocks = getBlocks(keys[1], keys[3]);

			expect(blocks.length).toEqual(3);
			expect(blocks[0].getKey()).toEqual(keys[1]);
			expect(blocks[1].getKey()).toEqual(keys[2]);
			expect(blocks[2].getKey()).toEqual(keys[3]);
		});

		it('All Blocks Selected', () => {
			const blocks = getBlocks(keys[0], keys[3]);

			expect(blocks.length).toEqual(4);
			expect(blocks[0].getKey()).toEqual(keys[0]);
			expect(blocks[1].getKey()).toEqual(keys[1]);
			expect(blocks[2].getKey()).toEqual(keys[2]);
			expect(blocks[3].getKey()).toEqual(keys[3]);

		});
	});
});
