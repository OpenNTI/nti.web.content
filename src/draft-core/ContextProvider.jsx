import React from 'react';

import IdRegistry from './IdRegistry';

const registry = new IdRegistry();


export default class ContextProvider extends React.Component {
	static register (id, editor) {
		registry.register(id, editor);
	}


	static unregister (id, editor) {
		registry.unregister(id, editor);
	}


	static propTypes = {
		editor: React.PropTypes.shape({
			getPluginContext: React.PropTypes.func,

		}),
		editorID: React.PropTypes.string,
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
		this.addRegistryListener(props);
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
		let {editor, editorId} = props;

		while (editor && editor.editor) {
			editor = editor.editor;
		}

		if (!editor && editorId) {
			editor = registry.get(editorId);
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
		this.removeRegistryListener();
	}


	addRegistryListener (props = this.props) {
		const {editorId, internal} = props;

		this.removeRegistryListener(props);

		if (editorId && !internal) {
			registry.addListener(registry.getRegisterEvent(editorId), this.onEditorRegistered);
			registry.addListener(registry.getUnregisterEvent(editorId), this.onEditorUnregistered);
		}
	}


	removeRegistryListener (props = this.props) {
		const {editorId} = props;

		if (editorId) {
			registry.removeListener(registry.getRegisterEvent(editorId), this.onEditorRegistered);
			registry.removeListener(registry.getUnregisterEvent(editorId), this.onEditorUnregistered);
		}
	}


	onEditorRegistered = (editor) => {
		this.registerEditor(editor);
	}


	//link other instances of CoreContextProvider together.
	register (props = this.props) {
		if (!props.internal) {
			this.registerEditor(this.getEditor(props));
		}
	}


	registerEditor (editor) {
		if (editor && editor.editorContext) {
			editor.editorContext.addLink(this);
		}
	}


	addLink (otherContextProvider) {
		this.externalLinks = [...this.externalLinks, otherContextProvider];
	}


	onEditorUnregistered = (editor) => {
		this.unregisterEditor(editor);
	}


	unregister (props = this.props) {
		if (!props.internal) {
			this.unregisterEditor(this.getEditor(props));
		}
	}


	unregisterEditor (editor) {
		if (editor && editor.editorContext) {
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
