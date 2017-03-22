import React from 'react';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {HOC} from 'nti-web-commons';

import {Editor, Plugins, BLOCKS, STYLES} from '../../draft-core';
import {Parser} from '../../RST';

const {ItemChanges} = HOC;

function isTitleBlock (block, title) {
	return block && block.type === BLOCKS.HEADER_ONE && block.text === title;
}

function buildTitle (title, label) {
	return {
		data: {label},
		entityRanges: [],
		inlineStyleRanges: [],
		depth: 0,
		type: BLOCKS.HEADER_ONE,
		text: title
	};
}

function rstToEditorState (rst, title, options) {
	const draftState = rst && Parser.convertRSTToDraftState(rst, options);
	const {blocks, entityMap} = draftState || {blocks: []};

	const titleBlock = isTitleBlock(blocks[0], title) ? blocks[0] : null;
	const newBlocks = titleBlock ? blocks.slice(1) : blocks;

	const editorState = newBlocks && newBlocks.length ?
							EditorState.createWithContent(convertFromRaw({blocks:newBlocks, entityMap})) :
							EditorState.createEmpty();

	return {editorState, titleLabel: titleBlock && titleBlock.data && titleBlock.data.label};
}

function editorStateToRST (editorState, title, titleLabel) {
	const currentContent = editorState && editorState.getCurrentContent();
	const {blocks, entityMap} = convertToRaw(currentContent);

	const newBlocks = title ? [buildTitle(title, titleLabel), ...blocks] : blocks;

	return currentContent ? Parser.convertDraftStateToRST({blocks: newBlocks, entityMap}) : '';
}

// const externalLinks = Plugins.createExternalLinks();
const pastedText = Plugins.createFormatPasted({
	formatTypeChangeMap: {
		[BLOCKS.CODE]: BLOCKS.UNSTYLED
	},
	transformHTMLState (newContent) {
		const rst = Parser.convertDraftStateToRST(convertToRaw(newContent));
		const {editorState} = rstToEditorState(rst, null, {startingHeaderLevel: 2});

		return editorState ? editorState.getCurrentContent() : newContent;
	}
});

const plugins = [
	// externalLinks,
	pastedText,
	Plugins.createKeepFocusInView(),
	Plugins.createBlockBreakOut()
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


	get title () {
		const {contentPackage} = this.props;

		return contentPackage && contentPackage.title;
	}

	componentWillReceiveProps (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:oldValue} = this.props;

		if (nextValue !== oldValue && nextValue !== this.lastSavedContent) {
			this.setUpValue(nextProps);
		}
	}


	setUpValue (props = this.props) {
		const {value} = props;
		const {editorState, titleLabel} = rstToEditorState(value, this.title);
		const state = {editorState, title: this.title, titleLabel};

		if (this.state) {
			this.setState(state);
		} else {
			this.state = state;
		}
	}


	getRST () {
		const {titleLabel} = this.state;
		const editorState = this.editorRef && this.editorRef.editorState;

		return editorState ?
					editorStateToRST(editorState, this.title, titleLabel) :
					'';
	}


	onContentChange = (editorState) => {
		const {value:oldValue, onContentChange} = this.props;
		const {titleLabel} = this.state;
		const newValue = editorStateToRST(editorState, this.title, titleLabel);

		if (oldValue !== newValue) {
			this.lastSavedContent = newValue;
			onContentChange(newValue);
		}
	}


	onContentPackageChange = () => {
		const {title:oldTitle} = this.state;
		const newTitle = this.title;

		if (newTitle !== oldTitle && this.editorRef) {
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
