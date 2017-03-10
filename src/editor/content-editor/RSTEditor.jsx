import React from 'react';
import {INLINE_STYLE} from 'draft-js-utils';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {BLOCK_TYPE} from 'draft-js-utils';
import {HOC} from 'nti-web-commons';

import {Editor, Plugins} from '../../draft-core';
import {Parser} from '../../RST';

const {ItemChanges} = HOC;

// const externalLinks = Plugins.createExternalLinks();
const pastedText = Plugins.createFormatPasted({formatTypeChangeMap: {
	[BLOCK_TYPE.HEADER_ONE]: BLOCK_TYPE.HEADER_TWO,
	[BLOCK_TYPE.HEADER_TWO]: BLOCK_TYPE.HEADER_THREE,
	[BLOCK_TYPE.HEADER_THREE]: BLOCK_TYPE.HEADER_FOUR,
	[BLOCK_TYPE.HEADER_FOUR]: BLOCK_TYPE.HEADER_FOUR,
	[BLOCK_TYPE.HEADER_FIVE]: BLOCK_TYPE.HEADER_FOUR,
	[BLOCK_TYPE.HEADER_SIX]: BLOCK_TYPE.HEADER_FOUR
}});

const plugins = [
	// externalLinks,
	pastedText
];


const ALLOWED_STYLES = [
	INLINE_STYLE.BOLD,
	INLINE_STYLE.CODE,
	INLINE_STYLE.ITALIC,
	INLINE_STYLE.UNDERLINE
];

function rstToEditorState (rst, options) {
	const draftState = rst && Parser.convertRSTToDraftState(rst, options);

	return draftState && draftState.blocks.length ? EditorState.createWithContent(convertFromRaw(draftState)) : EditorState.createEmpty();
}

function editorStateToRST (editorState, options) {
	const currentContent = editorState && editorState.getCurrentContent();

	return currentContent ? Parser.convertDraftStateToRST(convertToRaw(currentContent), options) : '';
}

export default class RSTEditor extends React.Component {
	static propTypes = {
		value: React.PropTypes.string,
		contentPackage: React.PropTypes.object,
		onContentChange: React.PropTypes.func
	}

	setEditorRef = x => this.editorRef = x

	constructor (props) {
		super(props);
		this.setUpValue(props);
	}


	get parserOptions () {
		const {contentPackage} = this.props;

		return {
			title: contentPackage && contentPackage.title
		};
	}


	componentWillReceiveProps (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:oldValue} = this.props;

		if (nextValue !== oldValue) {
			this.setUpValue(nextProps);
		}
	}


	setUpValue (props = this.props) {
		const {value} = props;
		const parserOptions = this.parserOptions;
		const editorState = rstToEditorState(value, parserOptions);
		const state = {editorState, parserOptions};

		if (this.state) {
			this.setState(state);
		} else {
			this.state = state;
		}
	}


	onContentChange = (editorState) => {
		debugger;
		const {value:oldValue, onContentChange} = this.props;
		const newValue = editorStateToRST(editorState, this.parserOptions);

		if (oldValue !== newValue) {
			onContentChange(newValue);
		}
	}


	onContentPackageChange = () => {
		const {parserOptions:oldOptions} = this.state;
		const newOptions = this.parserOptions;

		if (newOptions.title !== oldOptions.title && this.editorRef) {
			this.onContentChange(this.editorRef.editorState);
		}
	}


	render () {
		const {contentPackage, ...otherProps} = this.props;
		const {editorState} = this.state;

		delete otherProps.onContentChange;
		delete otherProps.value;

		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChange}>
				<Editor
					ref={this.setEditorRef}
					className="content-editing-rst-editor"
					editorState={editorState}
					onContentChange={this.onContentChange}
					plugins={plugins}
					allowedInlineStyles={ALLOWED_STYLES}
					{...otherProps}
				/>
			</ItemChanges>
		);
	}
}
