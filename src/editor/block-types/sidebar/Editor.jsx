import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from '@nti/web-commons';
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor, Plugins, BLOCKS, NestedEditorWrapper, STYLE_SET } from '@nti/web-editor';

import {Parser} from '../../../RST';

function rstToDraft (rst) {
	const draftState = rst && Parser.convertRSTToDraftState(rst);
	const {blocks} = draftState || {blocks: []};

	return blocks && blocks.length ?
		EditorState.createWithContent(convertFromRaw(draftState)) :
		EditorState.createEmpty();
}

// function draftToRST (editorState) {
// 	const currentContent = editorState && editorState.getCurrentContent();

// 	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent)) : '';
// }

const plugins = [
	Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])}),
	Plugins.LimitStyles.create({allow: STYLE_SET}),
	// Plugins.BlockBreakOut.create()
];

export default class NTISidebar extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockId: PropTypes.string,
		blockProps: PropTypes.shape({
			setReadOnly: PropTypes.func
		})
	}

	attacthEditorRef = x => this.editor = x

	state = {};

	componentDidMount () {
		this.setupFor(this.props);
	}

	componentDidUpdate (prevProps) {
		const {block: prevBlock} = prevProps;
		const {block: newBlock} = this.props;

		if (prevBlock !== newBlock) {
			this.setupFor(this.props);
		}
	}

	setupFor (props) {
		const {block} = this.props;
		const data = block.get('data');
		const body = data.get('body') || [];
		const rst = body.join('\n');

		this.setState({
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


	onContentChange = () => {}

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
							contentChangeBuffer={0}
						/>
					)}
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}
}
