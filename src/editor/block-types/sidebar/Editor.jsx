import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from '@nti/web-commons';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {Editor, Plugins, BLOCKS, NestedEditorWrapper, STYLE_SET } from '@nti/web-editor';

import {Parser} from '../../../RST';

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

function getRSTForBlock (block) {
	const data = block.get('data');
	const body = data.get('body') || [];

	return body.join('\n');
}

const plugins = [
	Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])}),
	Plugins.LimitStyles.create({allow: STYLE_SET}),
	Plugins.BlockBreakOut.create(),
	Plugins.ExternalLinks.create({allowedInBlockTypes: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])})
];

export default class NTISidebar extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockId: PropTypes.string,
		blockProps: PropTypes.shape({
			setReadOnly: PropTypes.func,
			setBlockData: PropTypes.func
		})
	}

	attacthEditorRef = x => this.editor = x

	state = {}

	pendingSaves = []

	isPendingSave (value) {
		this.pendingSaves.some(save => save === value);
	}

	cleanUpPending (value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}


	componentDidMount () {
		this.setupFor(this.props);
	}

	componentDidUpdate (prevProps) {
		const {block: prevBlock} = prevProps;
		const {block: newBlock} = this.props;
		const newBody = getRSTForBlock(newBlock);

		if (prevBlock !== newBlock) {
			if (this.isPendingSave(newBody)) {
				this.cleanUpPending(newBody);
			} else {
				this.setupFor(this.props);
			}
		}
	}

	setupFor (props) {
		const {block} = this.props;
		const data = block.get('data');
		const body = data.get('body') || [];
		const rst = body.join('\n');

		this.setState({
			bodyRST: rst,
			editorState: rstToDraft(rst)
		});
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
		const {blockProps: {setBlockData}} = this.props;
		const {bodyRST} = this.state;
		const newBody = draftToRST(editorState);

		if (setBlockData && newBody !== bodyRST) {
			this.pendingSaves.push(newBody);
			setBlockData({
				body: draftToRST(editorState).split('\n')
			});
		}
	}

	startEditing = () => {
		const {blockProps} = this.props;

		blockProps.setReadOnly(true);
	}


	stopEditing = () => {
		const {blockProps} = this.props;

		blockProps.setReadOnly(false);
	}

	render () {
		const {blockId} = this.props;
		const {editorState, selectableValue} = this.state;

		return (
			<Selection.Component className="content-editing-sidebar-editor" value={selectableValue} id={`${blockId}-editor`}>
				<NestedEditorWrapper onFocus={this.startEditing} onBlur={this.stopEditing}>
					{editorState && (
						<Editor
							ref={this.attacthEditorRef}
							editorState={editorState}
							plugins={plugins}
							onFocus={this.onEditorFocus}
							onBlur={this.onEditorBlur}
							onContentChange={this.onContentChange}
						/>
					)}
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}
}
