import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {encodeForURI} from 'nti-lib-ntiids';
import {ActiveState} from 'nti-web-commons';

export default class ToCNode extends React.Component {
	static propTypes = {
		node: PropTypes.object,
		title: PropTypes.string,
		type: PropTypes.string,
		highlight: PropTypes.string,
		filtered: PropTypes.bool,
		onSelectNode: PropTypes.func,
		root: PropTypes.string
	}


	//TODO: Have these come from a mixin
	static contextTypes = {
		router: PropTypes.object,
		defaultEnvironment: PropTypes.object
	}

	getNavigable () {
		const {context: {router, defaultEnvironment}} = this;

		return router || defaultEnvironment;
	}


	makeHref (path) {
		const n = this.getNavigable();

		return n.makeHref(path);
	}


	getClassName () {
		const {filtered, node, type:propType} = this.props;
		const {children} = node;
		const type = propType || node.type;

		return cx('table-of-contents-node', type, {
			filtered,
			'no-children': children.length === 0
		});
	}


	onClick = () => {
		const {node, onSelectNode} = this.props;


		if (onSelectNode) {
			onSelectNode(node);
		}
	}


	render () {
		const {onSelectNode} = this.props;

		return onSelectNode ? this.renderDisplay() : this.renderLink();
	}


	renderDisplay () {
		return (
			<div className={this.getClassName()} onClick={this.onClick}>
				{this.renderNode()}
			</div>
		);
	}


	renderLink () {
		const {root, node} = this.props;
		const prefix = this.makeHref(`/${root}/`);
		const getFirstNonAnchorParent = n => (!n || !n.parent || !n.isAnchor()) ? n : getFirstNonAnchorParent(n.parent);

		let {id} = node;
		let href = prefix;

		if (id && id !== root) {
			let fragment = '';


			if (node.isAnchor()) {
				let parent = getFirstNonAnchorParent(node) || {};

				id = parent.id;
				fragment = `#${node.getAchorTarget()}`;
			}

			href = `${prefix}${encodeForURI(id)}/${fragment}`;
		}

		return (
			<ActiveState hasChildren href={href} tag="div" className={this.getClassName()}>
				{this.renderNode({href})}
			</ActiveState>
		);
	}


	renderNode (extraProps) {
		const {node, highlight, filtered, title:propTitle} = this.props;
		const title = propTitle || node.title;

		const props = {...extraProps, title};
		const innerProps = {children: title};

		if (highlight && !filtered) {
			delete innerProps.children;

			let re = node.getMatchExp(highlight);
			let highlightedTitle = title.replace(re, x => `<span class="hit">${x}</span>`);

			innerProps.dangerouslySetInnerHTML = {__html: highlightedTitle};
		}

		return (
			<a {...props}>
				<span className="toc-label" {...innerProps} />
			</a>
		);
	}
}
