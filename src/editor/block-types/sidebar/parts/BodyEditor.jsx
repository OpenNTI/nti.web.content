import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from '@nti/web-commons';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {Editor, Plugins, BLOCKS, NestedEditorWrapper, STYLE_SET } from '@nti/web-editor';

import {Parser} from '../../../../RST';

function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
		EditorState.createWithContent(convertFromRaw(draftState)) :
		EditorState.createEmpty();
}

function draftToRST (editorState) {
	const currentContent = editorState && editorState.getCurrentContent();

	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent)) : '';
}

const plugins = [
	Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])}),
	Plugins.LimitStyles.create({allow: STYLE_SET}),
	Plugins.BlockBreakOut.create(),
	Plugins.ExternalLinks.create({allowedInBlockTypes: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])})
];

export default class NTISidebarBody extends React.Component {
	static propTypes = {
		value: PropTypes.string,
		blockId: PropTypes.string,
		setReadOnly: PropTypes.func,
		onChange: PropTypes.func
	}

	state = {}
	pendingSaves = []

	isPendingSave (value) {
		return this.pendingSaves.some(save => save === value);
	}

	cleanUpPending (value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}

	attachEditorRef = x => this.editor = x

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {value:oldValue} = prevProps;
		const {value:newValue} = this.props;

		if (newValue !== oldValue) {
			if (this.isPendingSave(newValue)) {
				this.cleanUpPending(newValue);
			} else {
				this.setupFor(this.props);
			}
		}
	}


	setupFor (props) {
		const {value} = this.props;

		this.setState({
			editorState: rstToDraft(value)
		});
	}


	startEditing = () => {
		const {setReadOnly} = this.props;

		if (setReadOnly) {
			setReadOnly(true);
		}
	}


	stopEditing = () => {
		const {setReadOnly} = this.props;

		if (setReadOnly) {
			setReadOnly(false);
		}
	}


	onEditorFocus = () => {
		this.setState({
			selectableValue: this.editor
		});
	}


	onEditorBlur = () => {
		this.setState({
			selectableValue: null
		});
	}


	onContentChange = (editorState) => {
		const {value:oldValue, onChange} = this.props;
		const newValue = draftToRST(editorState);

		if (onChange && newValue !== oldValue)	{
			this.pendingSaves.push(newValue);
			onChange(newValue);
		}
	}

	render () {
		const {blockId} = this.props;
		const {editorState, selectableValue} = this.state;

		return (
			<Selection.Component className="content-editing-sidebar-body-editor" value={selectableValue} id={`${blockId}-body-editor`}>
				<NestedEditorWrapper onFocus={this.startEditing} onBlur={this.stopEditingo}>
					{editorState && (
						<Editor
							ref={this.attachEditorRef}
							editorState={editorState}
							plugins={plugins}
							onFocus={this.onEditorFocus}
							onBlur={this.onEditorBlur}
							onContentChange={this.onContentChange}
							contentChagneBuffer={300}
						/>
					)}
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}

}
