import React from 'react';
import cx from 'classnames';
import UserAgent from 'fbjs/lib/UserAgent';
import Editor from 'draft-js-plugins-editor';
import {EditorState} from 'draft-js';

import ContextProvider from '../ContextProvider';
import fixStateForAllowed, {STYLE_SET, BLOCK_SET} from '../fixStateForAllowed';

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


	onChange = (editorState) => {
		const {onChange, allowedInlineStyles, allowedBlockTypes, allowLinks} = this.props;
		const state = fixStateForAllowed(editorState, allowedInlineStyles, allowedBlockTypes, allowLinks);

		this.setState({currentEditorState: state}, () => {
			onChange(editorState);
		});
	}


	render () {
		const {className} = this.props;
		const {currentEditorState:editorState, currentPlugins:plugins, busy} = this.state;

		const contentState = editorState.getCurrentContent();
		const hidePlaceholder = !contentState.hasText() && contentState.getBlockMap().first().getType() !== 'unstyled';

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
					/>
				</div>
			</ContextProvider>
		);
	}
}
