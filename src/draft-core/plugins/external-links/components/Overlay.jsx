import React from 'react';
import {Entity} from 'draft-js';
import  cx from 'classnames';

import {getEventFor} from '../../Store';
import {SelectedEntityKey, Editor} from '../Constants';

const selectedEntityKeyEvent = getEventFor(SelectedEntityKey);
const editorEvent = getEventFor(Editor);


function getPosition (entityCmp, editor) {
	const entityRect = entityCmp.getBoundingClientRect();
	const editorRect = editor.getBoundingClientRect();

	return {
		top: `${entityRect.top - editorRect.top}px`,
		left: `${entityRect.left - editorRect.left}px`
	};
}

export default class ExternalLinkOverlay extends React.Component {
	static propTypes = {
		store: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		})
	}


	state = {selectedEntity: null, position: null}

	events = {
		[selectedEntityKeyEvent]: (x) => this.onSelectedEntityKeyChanged(x),
		[editorEvent]: (x) => this.onEditorChanged(x)
	}


	componentDidMount () {
		const {store} = this.props;

		if (store) {
			store.addListeners(this.events);
		}
	}


	componentWillUnmount () {
		const {store} = this.props;

		if (store) {
			store.removeListeners(this.events);
		}
	}


	onSelectedEntityKeyChanged = (entityKey) => {
		const {store} = this.props;
		const {editor} = this.state;
		const entity = entityKey && Entity.get(entityKey);
		const entityCmp = entityKey && store.getItem(entityKey);
		const position = editor && entityCmp ? getPosition(entityCmp, editor) : null;

		this.setState({
			entity,
			entityCmp,
			position
		});
	}


	onEditorChanged = (editor) => {
		const {entityCmp} = this.state;
		const position = entityCmp && editor ? getPosition(entityCmp, editor) : null;

		this.setState({
			editor,
			position
		});
	}


	render () {
		const {position, entity} = this.state;
		const cls = cx('external-link-overlay', {hidden: !position || !entity});

		return (
			<div className={cls} style={position}>
				<span>External Link Overlay</span>
			</div>
		);
	}
}
