import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import {} from 'nti-web-commons';

export default class ToCNode extends React.Component {
	static propTypes = {
		node: PropTypes.object,
		highlight: PropTypes.string,
		filtered: PropTypes.bool,
		doNavigation: PropTypes.func,
		root: PropTypes.string
	}


	//TODO: Have this come from a mixin
	static contextTypes = {
		router: PropTypes.object,
		defaultEnvironment: PropTypes.object
	}


	getClassName () {
		const {filtered, node} = this.props;
		const {children, type} = node;

		return cx('table-of-contents-node', type, {
			filtered,
			'no-children': children.length === 0
		});
	}


	onClick = () => {
		const {node, doNavigation} = this.props;


		if (doNavigation) {
			doNavigation(node);
		}
	}


	render () {
		const {doNavigation} = this.props;

		return doNavigation ? this.renderDisplay() : this.renderLink();
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
		const {node, highlight, filtered} = this.props;
		const {title} = node;

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
