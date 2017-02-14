import React from 'react';
import cx from 'classnames';
import UserAgent from 'fbjs/lib/UserAgent';
import Editor from 'draft-js-plugins-editor';
import {EditorState, RichUtils} from 'draft-js';

import ContextProvider from '../ContextProvider';
import fixStateForAllowed, {STYLE_SET, BLOCK_SET} from '../fixStateForAllowed';

const ALLOWED_STYLES = Symbol('Allowed Styles');
const ALLOWED_BLOCKS = Symbol('Allowed Blocks');

export default class DraftCoreEditor extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		editorState: React.PropTypes.object.isRequired,
		plugins: React.PropTypes.array,
		onChange: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		onFocus: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		allowedInlineStyles: React.PropTypes.array,
		allowedBlockTypes: React.PropTypes.array,
		allowLinks: React.PropTypes.bool
	}

	static defaultProps = {
		editorState: EditorState.createEmpty(),
		plugins: [],
		onChange: () => {},
		onBlur: () => {},
		onFocus: () => {},
		allowedInlineStyles: STYLE_SET,
		allowedBlockTypes: BLOCK_SET,
		allowLinks: true
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
		this[ALLOWED_STYLES] = this[ALLOWED_STYLES] || new Set(this.props.allowedInlineStyles);

		return this[ALLOWED_STYLES];
	}

	get allowedBlockTypes () {
		this[ALLOWED_BLOCKS] = this[ALLOWED_BLOCKS] || new Set(this.props.allowedBlockTypes);

		return this[ALLOWED_BLOCKS];
	}

	get allowLinks () {
		return this.props.allowLinks;
	}


	get currentInlineStyles () {
		const {currentEditorState} = this.state;

		return currentEditorState && currentEditorState.getCurrentInlineStyle();
	}


	get currentBlockType () {
		//TODO: fill this out
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


	componentDidUpdate () {
		delete this[ALLOWED_STYLES];
		delete this[ALLOWED_BLOCKS];
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


	onChange = (editorState, cb) => {
		const {onChange, allowedInlineStyles, allowedBlockTypes, allowLinks} = this.props;
		const state = fixStateForAllowed(editorState, allowedInlineStyles, allowedBlockTypes, allowLinks);

		this.setState({currentEditorState: state}, () => {
			if (typeof cb === 'function') {
				cb();
			}

			onChange(editorState);
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
					/>
				</div>
			</ContextProvider>
		);
	}
}
