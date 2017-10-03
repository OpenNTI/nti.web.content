import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Node from './Node';


export default class ToCTree extends React.Component {
	static propTypes = {
		node: PropTypes.object.isRequired,
		filter: PropTypes.string,
		doNavigation: PropTypes.func
	}


	get root () {
		const {node} = this.props;

		return node.id;
	}


	render () {
		const {node, filter} = this.props;

		return this.renderTree(node, filter);
	}


	renderTree (node, filter) {
		if (!node.isTopic() || node.isBeyondLevel()) { return null; }

		const {doNavigation} = this.props;
		const {type, children} = node;

		const filtered = filter && !node.matches(filter, false);
		const branches = (children || [])
			.map((child) => this.renderTree(child, filter))
			.filter(x => x);


		const prune = filtered && !branches.length;

		return prune ?
			null :
			(
				<div className={cx('outline-tree', type, {filtered})}>
					<Node node={node} filtered={filtered} highlight={filter} doNavigation={doNavigation} root={this.root} />
					{branches}
				</div>
			);
	}
}
