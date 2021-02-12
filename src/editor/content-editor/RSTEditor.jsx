import PropTypes from 'prop-types';
import React from 'react';
import {HOC, Errors} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {Editor, Plugins, Parsers, BLOCKS, STYLES} from '@nti/web-editor';
import {Parsers as ReadingParsers} from '@nti/web-reading';
import {SelectionState} from 'draft-js';

import {CustomRenderers, CustomStyles} from '../block-types';

const DEFAULT_TEXT = {
	placeholder: 'Start writing or add an image...'
};

const t = scoped('web-content.editor.content-editor.rsteditor', DEFAULT_TEXT);

const {ItemChanges} = HOC;
const Parser = ReadingParsers.RST;

function isTitleBlock (block) {
	return block && block.type === BLOCKS.HEADER_ONE;
}

function buildTitle (title, label) {
	const HTML_ENT = {
		'&': 'amp',
		'<': 'lt',
		'>': 'gt'
	};
	return {
		data: {label},
		entityRanges: [],
		inlineStyleRanges: [],
		depth: 0,
		type: BLOCKS.HEADER_ONE,
		text: title.replace(/[<&>]/g, (ch)=> `&${HTML_ENT[ch]};`)
	};
}

function rstToEditorState (rst, options) {
	try {
		const draftState = rst && Parser.toRawDraftState(rst, options);
		const {blocks, entityMap} = draftState || {blocks: []};

		const titleBlock = isTitleBlock(blocks[0]) ? blocks[0] : null;
		const newBlocks = titleBlock ? blocks.slice(1) : blocks;

		const editorState = newBlocks && newBlocks.length ?
			Parsers.Utils.getStateForRaw({blocks:newBlocks, entityMap}) :
			Parsers.Utils.getEmptyState();

		return {editorState, titleLabel: titleBlock && titleBlock.data && titleBlock.data.label};
	} catch (e) {
		return {
			editorState: Parsers.Utils.getEmptyState(),
			error: e
		};
	}
}

function editorStateToRST (editorState, title, titleLabel) {
	const {blocks, entityMap} = Parsers.Utils.getRawForState(editorState);

	const newBlocks = title ? [buildTitle(title, titleLabel), ...blocks] : blocks;

	return editorState.getCurrentContent() ? Parser.fromRawDraftState({blocks: newBlocks, entityMap}) : '';
}


const ALLOWED_BLOCKS = new Set([
	BLOCKS.ATOMIC,
	BLOCKS.HEADER_FIVE,
	BLOCKS.HEADER_FOUR,
	BLOCKS.HEADER_ONE,
	BLOCKS.HEADER_SIX,
	BLOCKS.HEADER_THREE,
	BLOCKS.HEADER_TWO,
	BLOCKS.ORDERED_LIST_ITEM,
	BLOCKS.UNORDERED_LIST_ITEM,
	BLOCKS.BLOCKQUOTE,
	BLOCKS.UNSTYLED
]);

const ALLOWED_STYLES = new Set([
	STYLES.BOLD,
	STYLES.CODE,
	STYLES.ITALIC,
	STYLES.UNDERLINE
]);


// const externalLinks = Plugins.createExternalLinks();
const pastedText = Plugins.FormatPasted.create({
	formatTypeChangeMap: {
		[BLOCKS.CODE]: BLOCKS.UNSTYLED
	},
	transformHTMLState (newContent) {
		const rst = Parser.fromRawDraftState(Parsers.Utils.getRawForState(newContent));
		const {editorState} = rstToEditorState(rst, {startingHeaderLevel: 2});

		if (!editorState) { return newContent; }

		const rstContent = editorState.getCurrentContent();
		const rstBlocks = rstContent.getBlocksAsArray();
		const clamp = (i) => Math.max(0, Math.min(rstBlocks.length - 1, i));

		const selection = newContent.getSelectionAfter();

		const startKey = selection.getAnchorKey();
		const startIndex = newContent.getBlocksAsArray().findIndex(b => b.getKey() === startKey);
		const newStartKey = rstBlocks[clamp(startIndex)].getKey();
		const startOffset = selection.getAnchorOffset();

		const endKey = selection.getFocusKey();
		const endIndex = newContent.getBlocksAsArray().findIndex(b => b.getKey() === endKey);
		const newEndKey = rstBlocks[clamp(endIndex)].getKey();
		const endOffset = selection.getFocusOffset();

		return rstContent.set(
			'selectionAfter',
			new SelectionState({
				anchorKey: newStartKey,
				anchorOffset: startOffset,
				focusKey: newEndKey,
				focusOffset: endOffset
			})
		);
	}
});

const customBlocks = Plugins.CustomBlocks.create({customRenderers: CustomRenderers, customStyles: CustomStyles});

const plugins = [
	Plugins.LimitBlockTypes.create({allow: ALLOWED_BLOCKS}),
	Plugins.LimitStyles.create({allow: ALLOWED_STYLES}),
	Plugins.ExternalLinks.create({allowedInBlockTypes: new Set([BLOCKS.UNSTYLED, BLOCKS.ORDERED_LIST_ITEM, BLOCKS.UNORDERED_LIST_ITEM, BLOCKS.BLOCKQUOTE])}),
	Plugins.InsertBlock.create(),
	customBlocks,
	pastedText,
	Plugins.KeepFocusInView.create(),
	Plugins.BlockBreakOut.create(),
	Plugins.ContiguousEntities.create(),
];



export default class RSTEditor extends React.Component {
	static propTypes = {
		value: PropTypes.string,
		contentPackage: PropTypes.object,
		course: PropTypes.object,
		onContentChange: PropTypes.func
	}

	setEditorRef = x => this.editorRef = x

	constructor (props) {
		super(props);

		const {course} = this.props;

		this.pendingSaves = [];

		this.setupValue(props);

		customBlocks.mergeExtraProps({course});
	}


	get title () {
		const {contentPackage} = this.props;

		return contentPackage && contentPackage.title;
	}

	isPendingSave (value) {
		for (let save of this.pendingSaves) {
			if (save === value) {
				return true;
			}
		}

		return false;
	}


	cleanUpPending (value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}

	componentDidUpdate (prevProps) {
		const {value, course} = this.props;
		const {value: prevValue, course: prevCourse} = prevProps;

		if (value !== prevValue && !this.isPendingSave(value)) {
			this.setupValue(this.props);
		}

		if (course !== prevCourse) {
			customBlocks.mergeExtraProps({course});
		}

		this.cleanUpPending(value);
	}


	setupValue (props = this.props) {
		const {value} = props;
		const {editorState, titleLabel, error} = rstToEditorState(value);
		const state = {editorState, title: this.title, titleLabel, error};

		if (this.state) {
			this.setState(state);
		} else {
			//eslint-disable-next-line react/no-direct-mutation-state
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
			this.pendingSaves.push(newValue);
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
		const {editorState, error} = this.state;

		delete otherProps.onContentChange;
		delete otherProps.value;

		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChange}>
				{error ?
					(<Errors.Message error={error} />) :
					(
						<Editor
							ref={this.setEditorRef}
							id="content-editor"
							className="content-editing-rst-editor"
							editorState={editorState}
							onContentChange={this.onContentChange}
							plugins={plugins}
							placeholder={t('placeholder')}
							{...otherProps}
						/>
					)
				}
			</ItemChanges>
		);
	}
}
