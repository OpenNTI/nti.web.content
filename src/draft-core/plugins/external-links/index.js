import React from 'react';
import {wait} from 'nti-commons';

import {createStore} from '../Store';

import {SelectedEntityKey, EditorComponent} from './Constants';
import strategy from './strategy';
import {getSelectedEntityKey} from './utils';
import Link from './components/Link';
import Overlay from './components/Overlay';


export default (config = {}) => {
	const store = createStore(config.initialState);

	return {
		setEditor (editor) {
			store.setItem(EditorComponent, editor);
		},

		onChange (editorState) {
			const entityKey = getSelectedEntityKey(editorState);

			//Wait an event pump to give subsequent events a chance
			//to fire and set up the store appropriately
			wait()
				.then(() => {
					store.setItem(SelectedEntityKey, entityKey);
				});


			return editorState;
		},

		decorators: [
			{
				strategy,
				component: function LinkWrapper (props) {
					return (
						<Link store={store} {...props} />
					);
				}
			}
		],

		overlayComponent: function OverlayWrapper (props) {
			return (
				<Overlay {...props} store={store} />
			);
		}
	};
};
