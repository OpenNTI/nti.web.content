import PropTypes from 'prop-types';
import React from 'react';
import {HOC} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';
import {Editor, Plugins, Parsers, BLOCKS, STYLES} from '@nti/web-editor';

import {Parser} from '../../RST';
import {CustomRenderers, CustomStyles} from '../block-types';

const DEFAULT_TEXT = {
	placeholder: 'Start writing or add an image...'
};

const t = scoped('web-content.editor.content-editor.rsteditor', DEFAULT_TEXT);

const {ItemChanges} = HOC;

function isTitleBlock (block) {
	return block && block.type === BLOCKS.HEADER_ONE;
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

function rstToEditorState (rst, options) {
	const draftState = rst && Parser.convertRSTToDraftState(rst, options);
	const {blocks, entityMap} = draftState || {blocks: []};

	const titleBlock = isTitleBlock(blocks[0]) ? blocks[0] : null;
	const newBlocks = titleBlock ? blocks.slice(1) : blocks;

	const editorState = newBlocks && newBlocks.length ?
		Parsers.getStateForRaw({blocks:newBlocks, entityMap}) :
		Parsers.getEmptyState();

	return {editorState, titleLabel: titleBlock && titleBlock.data && titleBlock.data.label};
}

function editorStateToRST (editorState, title, titleLabel) {
	const {blocks, entityMap} = Parsers.getRawForState(editorState);

	const newBlocks = title ? [buildTitle(title, titleLabel), ...blocks] : blocks;

	return editorState.getCurrentContent() ? Parser.convertDraftStateToRST({blocks: newBlocks, entityMap}) : '';
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
		const rst = Parser.convertDraftStateToRST(Parsers.getRawForState(newContent));
		const {editorState} = rstToEditorState(rst, {startingHeaderLevel: 2});

		return editorState ? editorState.getCurrentContent() : newContent;
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

		this.setUpValue(props);

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


	setUpValue (props = this.props) {
		const {value} = props;
		const {editorState, titleLabel} = rstToEditorState(value);
		const state = {editorState, title: this.title, titleLabel};

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
		const {editorState} = this.state;

		delete otherProps.onContentChange;
		delete otherProps.value;

		return (
			<ItemChanges item={contentPackage} onItemChanged={this.onContentPackageChange}>
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
			</ItemChanges>
		);
	}
}
