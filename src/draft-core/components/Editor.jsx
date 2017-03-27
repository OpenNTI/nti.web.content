import React from 'react';
import cx from 'classnames';
import UserAgent from 'fbjs/lib/UserAgent';
import Editor from 'draft-js-plugins-editor';
import {EditorState, RichUtils} from 'draft-js';
import {buffer} from 'nti-commons';

import ContextProvider from '../ContextProvider';
import fixStateForAllowed, {STYLE_SET, BLOCK_SET} from '../fixStateForAllowed';
import {getCurrentLink, getCurrentBlockType, createLink} from '../utils';

const CONTENT_CHANGE_BUFFER = 1000;

export default class DraftCoreEditor extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		editorState: React.PropTypes.object.isRequired,
		plugins: React.PropTypes.array,
		placeholder: React.PropTypes.string,

		allowedInlineStyles: React.PropTypes.array,
		allowedBlockTypes: React.PropTypes.array,
		allowLinks: React.PropTypes.bool,

		contentChangeBuffer: React.PropTypes.number,

		onChange: React.PropTypes.func,
		onContentChange: React.PropTypes.func,
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
		allowKeyBoardShortcuts: true,

		contentChangeBuffer: CONTENT_CHANGE_BUFFER
	}


	attachContextRef = (r) => this.editorContext = r
	attachEditorRef = (r) => this.draftEditor = r
	attachContainerRef = (r) => this.editorContainer = r

	constructor (props) {
		super(props);

		const {contentChangeBuffer, editorState, plugins} = props;

		this.onContentChangeBuffered = buffer(contentChangeBuffer, this.onContentChange);

		this.state = {
			currentEditorState: editorState,
			currentPlugins: plugins
		};
	}


	getBoundingClientRect () {
		return this.editorContainer && this.editorContainer.getBoundingClientRect ?
				this.editorContainer.getBoundingClientRect() :
				{top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0};
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
		const {allowLinks} = this.props;
		const {editorState} = this;
		const selection = editorState.getSelection();

		return allowLinks && !selection.isCollapsed();
	}


	get currentInlineStyles () {
		const {editorState} = this;

		return editorState && editorState.getCurrentInlineStyle();
	}


	get currentBlockType () {
		const {editorState} = this;

		return getCurrentBlockType(editorState);
	}


	get currentLink () {
		const {editorState} = this;

		return getCurrentLink(editorState);
	}


	componentDidMount () {
		const {plugins} = this.props;

		for (let plugin of plugins) {
			if (plugin.setEditor) {
				plugin.setEditor(this);
			}
		}
	}


	componentWillUnmount () {
		const {plugins} = this.props;

		for (let plugin of plugins) {
			if (plugin.setEditor) {
				plugin.setEditor(null);
			}
		}
	}


	componentWillReceiveProps (nextProps) {
		const {plugins:newPlugins, editorState:newEditorState, contentChangeBuffer:newContentChangeBuffer} = nextProps;
		const {plugins:oldPlugins, editorState:oldEditorState, contentChangeBuffer:oldContentChangeBuffer} = this.props;
		let newState = null;

		if (newContentChangeBuffer !== oldContentChangeBuffer) {
			this.onContentChangeBuffered = buffer(newContentChangeBuffer, this.onContentChange);
		}

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


	toggleLink (link, reclaimFocus) {
		const {editorState} = this;
		const selection = editorState.getSelection();
		const newState = RichUtils.toggleLink(editorState, selection, createLink(''));

		this.onChange(newState, () => {
			if (reclaimFocus) {
				this.focus();
			}
		});
	}


	onContentChange = () => {
		const {onContentChange} = this.props;
		const {currentEditorState} = this.state;

		if (onContentChange) {
			onContentChange(currentEditorState);
		}
	}


	onChange = (editorState, cb) => {
		const {onChange, allowedInlineStyles, allowedBlockTypes, allowLinks} = this.props;
		const {currentEditorState} = this.state;
		const state = fixStateForAllowed(editorState, allowedInlineStyles, allowedBlockTypes, allowLinks);

		this.setState({currentEditorState: state}, () => {
			if (typeof cb === 'function') {
				cb();
			}

			if (onChange) {
				onChange(state);
			}

			if (currentEditorState.getCurrentContent() !== editorState.getCurrentContent()) {
				this.onContentChangeBuffered();
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
		const {className, placeholder} = this.props;
		const {currentEditorState:editorState, currentPlugins:plugins, busy} = this.state;

		const contentState = editorState && editorState.getCurrentContent();
		const hidePlaceholder = contentState && !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled';
		const pluginClasses = plugins.map(x => x.editorClass);
		const pluginOverlays = plugins.map(x => x.overlayComponent).filter(x => x);

		const cls = cx(
			'nti-draft-core',
			className,
			pluginClasses,
			{
				busy,
				'auto-hyphenate': UserAgent.isBrowser('Firefox'),// || UserAgent.isBrowser('IE')
				'hide-placeholder': hidePlaceholder
			}
		);

		return (
			<div ref={this.attachContainerRef} className="nti-draft-core-container">
				<ContextProvider editor={this} ref={this.attachContextRef} internal>
					<div className={cls} onClick={this.focus}>
						<Editor
							ref={this.attachEditorRef}
							editorState={editorState}
							plugins={plugins}
							onChange={this.onChange}
							onFocus={this.onFocus}
							handleKeyCommand={this.handleKeyCommand}
							placeholder={placeholder}
						/>
					</div>
				</ContextProvider>
				{pluginOverlays.length ?
						pluginOverlays.map((x, index) => React.createElement(x, {key: index})) :
						null
				}
			</div>
		);
	}
}
