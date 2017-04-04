import React from 'react';
import {Editor, EditorState, Entity, convertFromRaw, CompositeDecorator} from 'draft-js';
import {mount} from 'enzyme';

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


export function getEditorState (raw) {
	return raw ? EditorState.createWithContent(convertFromRaw(raw), decorator) : EditorState.createEmpty(decorator);
}


export function getStateAndOffsetKeys (raw) {
	const state = getEditorState(raw);
	const wrapper = mount((<Editor editorState={state} />));
	const link = wrapper.find(`.${LINK_CLS}`);
	const offsetKeys = link.map(x => x.prop('data-offset-key'));
	const blockKeys = state.getCurrentContent().getBlocksAsArray().map(x => x.key);

	return {state, offsetKeys, blockKeys};
}
