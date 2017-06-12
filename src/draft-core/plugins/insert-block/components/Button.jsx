import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import {DnD} from 'nti-web-commons';
import {EditorState, SelectionState, Modifier} from 'draft-js';

import {DRAG_DATA_TYPE} from '../Constants';

// import PreventStealingFocus from '../../../components/PreventStealingFocus';

export default class Button extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		createBlock: PropTypes.func,
		createBlockProps: PropTypes.object,
		children: PropTypes.node,
		onDragStart: PropTypes.func,
		onDragEnd: PropTypes.func
	}

	static contextTypes = {
		editorContext: PropTypes.shape({
			plugins: PropTypes.shape({
				getInsertMethod: PropTypes.func,
				allowInsertBlock: PropTypes.bool,
				registerInsertHandler: PropTypes.func,
				unregisterInsertHandler: PropTypes.func
			})
		})
	}


	constructor (props) {
		super(props);

		this.dragInsertionId = uuid();
	}


	get editorContext () {
		return this.context.editorContext || {};
	}


	get pluginContext () {
		return this.editorContext.plugins || {};
	}


	get isAllowed () {
		return this.pluginContext.allowInsertBlock;
	}


	onClick = () => {
		this.handleInsertion();
	}


	handleInsertion = (selection) => {
		const {getInsertMethod} = this.pluginContext;
		const {createBlock, createBlockProps} = this.props;

		if (getInsertMethod && createBlock) {
			createBlock(getInsertMethod(selection), createBlockProps)
			.then(() => {
				const selectionState = this.editorContext.getSelection && this.editorContext.getSelection();
				const editorState = this.editorContext.editor && this.editorContext.editor.getEditorState && this.editorContext.editor.getEditorState();
				const contentState = editorState && editorState.getCurrentContent && editorState.getCurrentContent();
				const nextBlock = contentState && contentState.getBlockAfter(selectionState.focusKey);

				if (editorState && contentState) {
					let newEditorState;

					if (nextBlock) {
						newEditorState = EditorState.acceptSelection(editorState, SelectionState.createEmpty(nextBlock.getKey()));
					} else {
						const newContent = Modifier.insertText(contentState, selectionState, '\n', editorState.getCurrentInlineStyle(), null);
						const tmpEditorState = EditorState.push(editorState, newContent, 'insert-characters');
						newEditorState = EditorState.acceptSelection(tmpEditorState, SelectionState.createEmpty(newContent.getLastBlock().getKey()));
					}

					this.editorContext.editor.setEditorState(newEditorState);
					this.editorContext.editor.focus();
				}
			});
		}
	}


	onDragStart = (e) => {
		const {onDragStart} = this.props;
		const {registerInsertHandler} = this.pluginContext;

		if (registerInsertHandler) {
			registerInsertHandler(this.dragInsertionId, this.handleInsertion);
		}


		if (onDragStart) {
			onDragStart(e);
		}
	}


	onDragEnd = (e) => {
		const {onDragEnd} = this.props;
		const {unregisterInsertHandler} = this.pluginContext;

		if (unregisterInsertHandler) {
			unregisterInsertHandler(this.dragInsertionId);
		}


		if (onDragEnd) {
			onDragEnd(e);
		}
	}


	render () {
		const {children, className, ...otherProps} = this.props;
		const cls = cx(className, {disabled: !this.isAllowed});
		const data = [
			{dataTransferKey: DRAG_DATA_TYPE, dataForTransfer: this.dragInsertionId},
			{dataTransferKey: 'text', dataForTransfer: 'Insert'},
		];

		delete otherProps.createBlock;
		delete otherProps.createBlockProps;
		delete otherProps.onDragStart;
		delete otherProps.onDragEnd;

		return (
			<DnD.Draggable data={data} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
				<div {...otherProps} className={cls} onClick={this.onClick}>
					{children}
				</div>
			</DnD.Draggable>
		);
	}
}
