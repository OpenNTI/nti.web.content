import React from 'react';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {HOC} from 'nti-web-commons';

import {Editor, Plugins, BLOCKS, STYLES} from '../../draft-core';
import {Parser} from '../../RST';

const {ItemChanges} = HOC;

// const externalLinks = Plugins.createExternalLinks();
const pastedText = Plugins.createFormatPasted({formatTypeChangeMap: {
	[BLOCKS.HEADER_ONE]: BLOCKS.HEADER_TWO,
	[BLOCKS.HEADER_TWO]: BLOCKS.HEADER_THREE,
	[BLOCKS.HEADER_THREE]: BLOCKS.HEADER_FOUR,
	[BLOCKS.HEADER_FOUR]: BLOCKS.HEADER_FOUR,
	[BLOCKS.HEADER_FIVE]: BLOCKS.HEADER_FOUR,
	[BLOCKS.HEADER_SIX]: BLOCKS.HEADER_FOUR
}});

const plugins = [
	// externalLinks,
	pastedText,
	Plugins.createKeepFocusInView()
];


const ALLOWED_STYLES = [
	STYLES.BOLD,
	STYLES.CODE,
	STYLES.ITALIC,
	STYLES.UNDERLINE
];


const ALLOWED_BLOCKS = [
	BLOCKS.ATOMIC,
	BLOCKS.HEADER_FIVE,
	BLOCKS.HEADER_FOUR,
	BLOCKS.HEADER_ONE,
	BLOCKS.HEADER_SIX,
	BLOCKS.HEADER_THREE,
	BLOCKS.HEADER_TWO,
	BLOCKS.ORDERED_LIST_ITEM,
	BLOCKS.UNORDERED_LIST_ITEM,
	BLOCKS.UNSTYLED
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
					allowedBlockTypes={ALLOWED_BLOCKS}
					allowLinks={false}
					{...otherProps}
				/>
			</ItemChanges>
		);
	}
}
