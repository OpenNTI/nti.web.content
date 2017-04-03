import React from 'react';
import {Editor, EditorState, Entity, convertFromRaw, CompositeDecorator} from 'draft-js';
import {mount} from 'enzyme';

import {BLOCKS, ENTITIES, MUTABILITY} from '../../../../Constants';
import getSelectionForEntityKeyAtOffset from '../get-selection-for-entity-key-at-offset';

const LINK_CLS = 'link-component';

function findLinkEntities (contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();

			return (
				entityKey !== null &&
				Entity.get(entityKey).getType() === 'LINK'
			);
		},
		callback
	);
}

Link.propTypes = {
	offsetKey: React.PropTypes.string,
	children: React.PropTypes.any
};
function Link ({offsetKey, children}) {
	return (
		<div className={LINK_CLS} data-offset-key={offsetKey}>
			{children}
		</div>
	);
}


const decorator = new CompositeDecorator([
	{
		strategy: findLinkEntities,
		component: Link
	}
]);


function getEditorState (raw) {
	return raw ? EditorState.createWithContent(convertFromRaw(raw), decorator) : EditorState.createEmpty(decorator);
}


function getStateAndOffsetKey (raw) {
	const state = getEditorState(raw);
	const wrapper = mount((<Editor editorState={state} />));
	const link = wrapper.find(`.${LINK_CLS}`);
	const offsetKeys = link.map(x => x.prop('data-offset-key'));
	const blockKeys = state.getCurrentContent().getBlocksAsArray().map(x => x.key);

	return {state, offsetKeys, blockKeys};
}



describe('get-selection-for-entity-key-at-offset', () => {
	describe('Single Block Single Entity', () => {
		it('Start of block', () => {
			const {state, offsetKeys, blockKeys} = getStateAndOffsetKey({
				blocks: [
					{
						type: BLOCKS.UNSTYLED,
						depth: 0,
						text: 'link and then some',
						inlineStyleRanges: [],
						entityRanges: [{offset: 0, length: 4, key: 0}]
					}
				],
				entityMap: {
					0: {
						type: ENTITIES.LINK,
						mutability: MUTABILITY.MUTABLE,
						data: {name: 0, href: 'http://www.google.com'}
					}
				}
			});

			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[0], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(0);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(4);
		});

		it('Middle of block', () => {
			const {state, offsetKeys, blockKeys} = getStateAndOffsetKey({
				blocks: [
					{
						type: BLOCKS.UNSTYLED,
						depth: 0,
						text: 'Some text and a link and then some',
						inlineStyleRanges: [],
						entityRanges: [{offset: 16, length: 4, key: 0}]
					}
				],
				entityMap: {
					0: {
						type: ENTITIES.LINK,
						mutability: MUTABILITY.MUTABLE,
						data: {name: 0, href: 'http://www.google.com'}
					}
				}
			});

			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[0], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(16);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(20);
		});

		it('End of block', () => {
			const {state, offsetKeys, blockKeys} = getStateAndOffsetKey({
				blocks: [
					{
						type: BLOCKS.UNSTYLED,
						depth: 0,
						text: 'Some text and a link',
						inlineStyleRanges: [],
						entityRanges: [{offset: 16, length: 4, key: 0}]
					}
				],
				entityMap: {
					0: {
						type: ENTITIES.LINK,
						mutability: MUTABILITY.MUTABLE,
						data: {name: 0, href: 'http://www.google.com'}
					}
				}
			});

			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[0], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(16);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(20);
		});
	});

	describe('Single Block Multiple Entities', () => {
		let state = null;
		let offsetKeys = null;
		let blockKeys = null;

		beforeEach(() => {
			const {state:s, offsetKeys:o, blockKeys:b} = getStateAndOffsetKey({
				blocks: [
					{
						type: BLOCKS.UNSTYLED,
						depth: 0,
						text: 'Some text and a link. Then some more text and another link. And one more link for good measure',
						inlineStyleRanges: [],
						entityRanges: [
							{offset: 16, length: 4, key: 0},
							{offset: 54, length: 5, key: 0},
							{offset: 73, length: 4, key: 0}
						]
					}
				],
				entityMap: {
					0: {
						type: ENTITIES.LINK,
						mutability: MUTABILITY.MUTABLE,
						data: {name: 0, href: 'http://www.google.com'}
					}
				}
			});

			state = s;
			offsetKeys = o;
			blockKeys = b;
		});

		it('Selection for first entity range', () => {
			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[0], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(16);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(20);
		});


		it('Selection for second entity range', () => {
			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[1], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(54);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(59);
		});

		it('Selection for third entity range', () => {
			const selection = getSelectionForEntityKeyAtOffset(0, offsetKeys[2], state);

			expect(selection.getStartKey()).toEqual(blockKeys[0]);
			expect(selection.getStartOffset()).toEqual(73);

			expect(selection.getEndKey()).toEqual(blockKeys[0]);
			expect(selection.getEndOffset()).toEqual(77);
		});
	});
});

