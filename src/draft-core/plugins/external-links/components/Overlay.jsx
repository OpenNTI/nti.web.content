import React from 'react';
import {Entity} from 'draft-js';
import {Flyout} from 'nti-web-commons';

import {getEventFor} from '../../Store';
import {SelectedEntityKey, EditorComponent} from '../Constants';

import Editor from './Editor';

const selectedEntityKeyEvent = getEventFor(SelectedEntityKey);
const editorEvent = getEventFor(EditorComponent);


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
		const entity = entityKey && Entity.get(entityKey);
		const entityCmp = entityKey && store.getItem(entityKey);

		this.setState({
			entity,
			entityCmp,
		});
	}


	onEditorChanged = (editor) => {
		this.setState({
			editor
		});
	}


	render () {
		const {store} = this.props;
		const {entityCmp, editor, entity} = this.state;

		if (!entityCmp || !editor) {
			return null;
		}

		debugger;

		return (
			<Flyout.Aligned
				className="external-link-overlay"
				alignTo={entityCmp}
				parent={editor && editor.container}

				visible={entityCmp && editor ? true : false}
				arrow
				constrain

				verticalAlign={Flyout.ALIGNMENTS.BOTTOM}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			>
				<Editor entity={entity} store={store} />
			</Flyout.Aligned>
		);
	}
}
