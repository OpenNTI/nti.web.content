import React from 'react';


export default class ContextProvider extends React.Component {
	static propTypes = {
		editor: React.PropTypes.shape({
			getPluginContext: React.PropTypes.func,

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
			plugins: React.PropTypes.object
		})
	}


	constructor (props) {
		super(props);

		this.externalLinks = [];
		this.register(props);
	}


	getChildContext () {
		const editor = this.getEditor();
		const pluginContext = editor && editor.getPluginContext();

		return {
			editorContext: {
				editor,
				plugins: pluginContext,
				get editorState () { return editor && editor.editorState; }
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
