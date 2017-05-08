import React from 'react';
import PropTypes from 'prop-types';

import {ContextProvider} from '../../draft-core';
import {Buttons} from '../block-types';
import Store from '../Store';
import {SET_CONTENT_EDITOR} from '../Constants';


export default class BlockTypes extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		selectionManager: PropTypes.shape({
			addListener: PropTypes.func,
			removeListener: PropTypes.func
		})
	}

	state = {}

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {type} = data;

		if (type === SET_CONTENT_EDITOR) {
			this.setState({
				editor: Store.contentEditor
			});
		}
	}


	render () {
		const {contentPackage, course} = this.props;
		const {editor} = this.state;

		return (
			<ContextProvider editor={editor}>
				<div className="content-editor-block-types">
					{Buttons.map((button, key) => {
						return React.createElement(button, {key, contentPackage, course});
					})}
				</div>
			</ContextProvider>
		);
	}
}
