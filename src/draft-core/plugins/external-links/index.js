import React from 'react';

import {createStore} from '../Store';

import strategy from './strategy';
import {getSelectedEntityKey} from './utils';
import Link from './components/Link';


export default (config = {}) => {
	const store = createStore(config.initialState);

	return {
		onChange (editorState) {
			const entityKey = getSelectedEntityKey(editorState);

			store.setItem('selectedEntityKey', entityKey);

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
		]
	};
};
