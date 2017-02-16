import React from 'react';
import cx from 'classnames';
import UserAgent from 'fbjs/lib/UserAgent';
import Editor from 'draft-js-plugins-editor';
import {EditorState, RichUtils} from 'draft-js';

import ContextProvider from '../ContextProvider';
import fixStateForAllowed, {STYLE_SET, BLOCK_SET} from '../fixStateForAllowed';

export default class DraftCoreEditor extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		editorState: React.PropTypes.object.isRequired,
		plugins: React.PropTypes.array,
		placeholder: React.PropTypes.string,

		allowedInlineStyles: React.PropTypes.array,
		allowedBlockTypes: React.PropTypes.array,
		allowLinks: React.PropTypes.bool,

		onChange: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		onFocus: React.PropTypes.func,
		handleKeyCommand: React.PropTypes.func

	}

	static defaultProps = {
		editorState: EditorState.createEmpty(),
		plugins: [],
		allowedInlineStyles: STYLE_SET,
		allowedBlockTypes: BLOCK_SET,
		allowLinks: true,
		allowKeyBoardShortcuts: true
	}


	attachContextRef = (r) => this.editorContext = r
	attachEditorRef = (r) => this.draftEditor = r

	constructor (props) {
		super(props);

		this.state = {
			currentEditorState: props.editorState,
			currentPlugins: props.plugins
		};
	}


	get editorState () {
		return this.state.currentEditorState;
	}


	get allowedInlineStyles () {
		return new Set(this.props.allowedInlineStyles);
	}

	get allowedBlockTypes () {
		return new Set(this.props.allowedBlockTypes);
	}

	get allowLinks () {
		return this.props.allowLinks;
	}


	get currentInlineStyles () {
		const {editorState} = this;

		return editorState && editorState.getCurrentInlineStyle();
	}


	get currentBlockType () {
		const {editorState} = this;
		const selection = editorState.getSelection();
		const content = editorState.getCurrentContent();
		const start = selection.getStartKey();
		const end = selection.getEndKey();
		const block = content.getBlockForKey(start);

		return start === end ? block.getType() : '';
	}


	get currentLink () {
		//TODO: fill this out
	}


	componentWillReceiveProps (nextProps) {
		const {plugins:newPlugins, editorState:newEditorState} = nextProps;
		const {plugins:oldPlugins, editorState:oldEditorState} = this.props;
		let newState = null;

		if (newEditorState !== oldEditorState) {
			newState = newState || {};
			newState.currentEditorState = newEditorState;
		}

		if (newPlugins !== oldPlugins) {
			newState = newState || {};
			newState.currentPlugins = newPlugins;
		}

		if (newState) {
			this.setState(newState);
		}
	}


	focus = () => {
		debugger;
		const {editorState} = this;
		const hasFocus = editorState && editorState.getSelection().getHasFocus();

		if (!hasFocus && this.draftEditor) {
			this.draftEditor.focus();
		}
	}


	toggleInlineStyle (style, reclaimFocus) {
		const {editorState} = this;
		const newState = RichUtils.toggleInlineStyle(editorState, style);

		this.onChange(newState, () => {
			if (reclaimFocus) {
				this.focus();
			}
		});
	}


	toggleBlockType (type, reclaimFocus) {
		const {editorState} = this;
		const newState = RichUtils.toggleBlockType(editorState, type);

		this.onChange(newState, () => {
			if (reclaimFocus) {
				this.focus();
			}
		});
	}


	onChange = (editorState, cb) => {
		const {onChange, allowedInlineStyles, allowedBlockTypes, allowLinks} = this.props;
		const state = fixStateForAllowed(editorState, allowedInlineStyles, allowedBlockTypes, allowLinks);

		this.setState({currentEditorState: state}, () => {
			if (typeof cb === 'function') {
				cb();
			}

			if (onChange) {
				onChange(editorState);
			}
		});
	}


	onFocus = () => {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus(this);
		}
	}


	onBlur = () => {
		const {onBlur} = this.props;

		if (onBlur) {
			onBlur(this);
		}
	}


	handleKeyCommand = (command) => {
		const {handleKeyCommand} = this.props;

		//If the prop handles the key command let it
		if (handleKeyCommand && handleKeyCommand(command)) {
			return true;
		}

		//Otherwise do the default
		const {editorState} = this;
		const newState = RichUtils.handleKeyCommand(editorState, command);

		if (newState) {
			this.onChange(newState);
			return true;
		}

		return false;
	}


	render () {
		const {className} = this.props;
		const {currentEditorState:editorState, currentPlugins:plugins, busy} = this.state;

		const contentState = editorState && editorState.getCurrentContent();
		const hidePlaceholder = contentState && !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled';

		const cls = cx(
			'nti-draft-core',
			className,
			{
				busy,
				'auto-hyphenate': UserAgent.isBrowser('Firefox'),// || UserAgent.isBrowser('IE')
				'hide-placeholder': hidePlaceholder
			}
		);

		return (
			<ContextProvider editor={this} ref={this.attachContextRef} internal>
				<div className={cls}>
					<Editor
						ref={this.attachEditorRef}
						editorState={editorState}
						plugins={plugins}
						onChange={this.onChange}
						onFocus={this.onFocus}
						handleKeyCommand={this.handleKeyCommand}
					/>
				</div>
			</ContextProvider>
		);
	}
}
