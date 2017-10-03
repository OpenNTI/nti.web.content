import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Ellipsed} from 'nti-web-commons';

export default class ToCNode extends React.Component {
	static propTypes = {
		node: PropTypes.object,
		highlight: PropTypes.string,
		filtered: PropTypes.bool,
		doNavigation: PropTypes.func,
		root: PropTypes.string
	}


	getClassName () {
		const {filtered, node} = this.props;
		const {children, type} = node;

		return cx('outline-node', type, {
			filtered,
			'no-children': children.length === 0
		});
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

		const props = {...extraProps, title, children: title};

		if (highlight && !filtered) {
			delete props.children;

			let re = node.getMatchExp(highlight);
			let highlightedTitle = title.replace(re, x => `<span class="hit">${x}</span>`);

			props.dangerouslySetInnerHTML = {__html: highlightedTitle};
		}

		return (
			<Ellipsed tag="a" {...props} />
		);
	}
}
