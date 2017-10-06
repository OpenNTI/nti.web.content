import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import {} from 'nti-web-commons';

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


	//TODO: Have this come from a mixin
	static contextTypes = {
		router: PropTypes.object,
		defaultEnvironment: PropTypes.object
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
		//TODO: fill in the anchor...

		return this.renderDisplay();
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
				<span className="label" {...innerProps} />
			</a>
		);
	}
}
