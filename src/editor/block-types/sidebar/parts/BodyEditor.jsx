import './BodyEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {Editor, Plugins, BLOCKS, NestedEditorWrapper, STYLE_SET } from '@nti/web-editor';

import {rstToDraft, draftToRST, stopInsertDrop} from '../../utils';

const t = scoped('content.editor.block-types.sidebar.BodyEditor', {
	placeholder: 'Add content...'
});

const BLOCK_ID_TO_BODY_STATE = {};

export default class NTISidebarBody extends React.Component {
	static BLOCK_ID_TO_BODY_STATE = BLOCK_ID_TO_BODY_STATE

	static propTypes = {
		value: PropTypes.string,
		blockId: PropTypes.string,
		setReadOnly: PropTypes.func,
		onChange: PropTypes.func
	}

	state = {}
	pendingSaves = []

	constructor (props) {
		super(props);

		this.state = {
			plugins: [
				Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])}),
				Plugins.LimitStyles.create({allow: STYLE_SET}),
				Plugins.BlockBreakOut.create(),
				{handleDrop: stopInsertDrop}
				// Plugins.ExternalLinks.create({allowedInBlockTypes: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM])})
			]
		};
	}


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

	componentWillUnmount () {
		const {blockId} = this.props;

		delete BLOCK_ID_TO_BODY_STATE[blockId];
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
		const {value, blockId} = this.props;
		const editorState = rstToDraft(value);

		BLOCK_ID_TO_BODY_STATE[blockId] = editorState;

		this.setState({
			editorState
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
		const {value:oldValue, onChange, blockId} = this.props;
		const newValue = draftToRST(editorState);

		if (onChange && newValue !== oldValue)	{
			this.pendingSaves.push(newValue);
			BLOCK_ID_TO_BODY_STATE[blockId] = editorState;
			onChange(newValue);
		}
	}


	render () {
		const {blockId} = this.props;
		const {editorState, selectableValue, plugins} = this.state;

		return (
			<Selection.Component className="content-editing-sidebar-body-editor" value={selectableValue} id={`${blockId}-body-editor`}>
				<NestedEditorWrapper onFocus={this.startEditing} onBlur={this.stopEditing}>
					{editorState && (
						<Editor
							ref={this.attachEditorRef}
							editorState={editorState}
							plugins={plugins}
							onFocus={this.onEditorFocus}
							onBlur={this.onEditorBlur}
							onContentChange={this.onContentChange}
							contentChangeBuffer={300}
							placeholder={t('placeholder')}
						/>
					)}
				</NestedEditorWrapper>
			</Selection.Component>
		);
	}

}
