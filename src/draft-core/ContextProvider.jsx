import React from 'react';

const toggleInlineStyle = (x, editor) => editor && editor.toggleInlineStyle && editor.toggleInlineStyle(x, true);
const getAllowedInlineStyles = (editor) => (editor && editor.allowedInlineStyles) || null;
const getCurrentInlineStyles = (editor) => (editor && editor.currentInlineStyles) || null;

const toggleBlockType = (x, editor) => editor && editor.toggleBlockType && editor.toggleBlockType(x, true);
const getAllowedBlockTypes = (editor) => (editor && editor.allowedBlockTypes) || null;
const getCurrentBlockType = (editor) => (editor && editor.currentBlockType) || null;

const toggleLink = (x, editor) => editor && editor.toggleLink && editor.toggleLink(x, true);
const getAllowLinks = (editor) => (editor && editor.allowLinks) || null;
const getCurrentLink = (editor) => (editor && editor.currentLink) || null;


export default class ContextProvider extends React.Component {
	static propTypes = {
		editor: React.PropTypes.shape({
			toggleInlineStyle: React.PropTypes.func,
			getAllowedInlineStyles: React.PropTypes.func,
			getCurrentInlineStyles: React.PropTypes.func,

			toggleBlockType: React.PropTypes.func,
			getAllowedBlockTypes: React.PropTypes.func,
			getCurrentBlockType: React.PropTypes.string,

			toggleLink: React.PropTypes.func,
			getAllowLink: React.PropTypes.func,
			getCurrentLink: React.PropTypes.func
		}),
		children: React.PropTypes.element,

		/**
		 * Flag this instance as internal to Core. External ContextProviders add references to this one.
		 * @type {boolean}
		 */
		internal: React.PropTypes.bool
	}

	static childContextTypes = {
		editorContext: React.PropTypes.shape({
			editor: React.PropTypes.any,

			toggleInlineStyle: React.PropTypes.func,
			allowedInlineStyles: React.PropTypes.object,
			currentInlineStyles: React.PropTypes.object,

			toggleBlockType: React.PropTypes.func,
			allowedBlockTypes: React.PropTypes.object,
			currentBlockType: React.PropTypes.string,

			toggleLink: React.PropTypes.func,
			allowLinks: React.PropTypes.bool,
			currentLink: React.PropTypes.object
		})
	}


	constructor (props) {
		super(props);

		this.externalLinks = [];
		this.register(props);
	}


	getChildContext () {
		const editor = this.getEditor();

		return {
			editorContext: {
				editor,
				get editorState () { return editor && editor.editorState; },

				toggleInlineStyle (x) { return toggleInlineStyle(x, editor); },
				get allowedInlineStyles () { return getAllowedInlineStyles(editor); },
				get currentInlineStyles () { return getCurrentInlineStyles(editor); },

				toggleBlockType (x) { return toggleBlockType(x, editor); },
				get allowedBlockTypes () { return getAllowedBlockTypes(editor); },
				get currentBlockType () { return getCurrentBlockType(editor); },

				toggleLink (x) { return toggleLink(x, editor); },
				get allowLinks () { return getAllowLinks(editor); },
				get currentLink () { return getCurrentLink(editor); }
			}
		};
	}


	getEditor (props = this.props) {
		let {editor} = props;

		while (editor && editor.editor) {
			editor = editor.editor;
		}

		return editor;
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.editor !== this.props.editor) {
			this.unregister();
			this.register(nextProps);
		}

		for (let cmp of this.externalLinks) {
			if (cmp) {
				cmp.forceUpdate();
			}
		}
	}


	componentWillUnmount () {
		this.externalLinks = [];
		this.unregister();
	}


	//link other instances of CoreContextProvider together.
	register (props = this.props) {
		const editor = this.getEditor(props);

		if (editor && editor.editorContext && !props.internal) {
			editor.editorContext.addLink(this);
		}
	}


	addLink (otherContextProvider) {
		this.externalLinks = [...this.externalLinks, otherContextProvider];
	}


	unregister (props = this.props) {
		const editor = this.getEditor(props);

		if (editor && editor.editorContext && !props.internal) {
			editor.editorContext.removeLink(this);
		}
	}


	removeLink (otherContextProvider) {
		this.externalLinks = this.externalLinks.filter(x => x !== otherContextProvider);
	}


	render () {
		return React.Children.only(this.props.children);
	}
}
