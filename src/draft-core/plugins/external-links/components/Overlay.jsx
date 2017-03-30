import React from 'react';
import {Flyout} from 'nti-web-commons';

import {getEventFor} from '../../Store';
import {getCmpForSelection} from '../utils';
import {SelectedEntityKey, EditorComponent, EditingEntityKey} from '../Constants';

import Editor from './Editor';

const selectedEntityKeyEvent = getEventFor(SelectedEntityKey);
const editingEntityKeyEvent = getEventFor(EditingEntityKey);
const editorEvent = getEventFor(EditorComponent);

export default class ExternalLinkOverlay extends React.Component {
	static propTypes = {
		store: React.PropTypes.shape({
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func
		}),
		getEditorState: React.PropTypes.func,
		setEditorState: React.PropTypes.func
	}


	state = {selectedEntity: null, position: null}

	events = {
		[selectedEntityKeyEvent]: (x) => this.onSelectedEntityKeyChanged(x),
		[editingEntityKeyEvent]: (x) => this.onEditingEntityKeyChanged(x),
		[editorEvent]: (x) => this.onEditorChanged(x)
	}


	get editorSelection () {
		const {getEditorState} = this.props;
		const editorState = getEditorState && getEditorState();

		return editorState && editorState.getSelection();
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
		const key = store.getItem(EditingEntityKey) || entityKey;
		const entityCmp = key && getCmpForSelection(store.getItem(key) || [], this.selection);

		this.setState({
			entityCmp,
			entityKey: key
		});
	}


	onEditingEntityKeyChanged = (entityKey) => {
		const {store} = this.props;
		const key = entityKey || store.getItem(SelectedEntityKey);
		const entityCmp = key && getCmpForSelection(store.getItem(key) || [], this.selection);

		this.setState({
			entityCmp,
			entityKey: key
		});
	}


	onEditorChanged = (editor) => {
		this.setState({
			editor
		});
	}


	render () {
		const {store} = this.props;
		const {entityCmp, editor, entityKey} = this.state;

		if (!entityCmp || !editor) {
			return null;
		}

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
				<Editor entityKey={entityKey} store={store} />
			</Flyout.Aligned>
		);
	}
}
