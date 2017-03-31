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



describe('get-selection-for-entity-key-at-offset', () => {
	describe('Single Block', () => {
		it('Start of block', () => {
			const state = getEditorState({
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
			const wrapper = mount((<Editor editorState={state}/>));
			const link = wrapper.find(`.${LINK_CLS}`);
			const offsetKey = link.prop('data-offset-key');

			const selection = getSelectionForEntityKeyAtOffset(0, offsetKey, state);
		});
	});
});

