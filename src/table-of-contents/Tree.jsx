import './Tree.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

import Node from './Node';

const DEFAULT_TEXT = {
	empty: 'No Table of Contents',
	noMatch: 'No Matches',
};

const t = scoped('web-content.table-of-contents.tree', DEFAULT_TEXT);

export default class ToCTree extends React.Component {
	static propTypes = {
		node: PropTypes.object.isRequired,
		filter: PropTypes.string,
		onSelectNode: PropTypes.func,
	};

	get root() {
		const { node } = this.props;

		return node.id;
	}

	render() {
		const { node, filter } = this.props;
		const tree = this.renderTree(node, filter);

		return (
			<div className="table-of-contents-tree">
				{tree}
				{!tree && (
					<div className="empty-toc">
						{t(filter ? 'noMatch' : 'empty')}
					</div>
				)}
			</div>
		);
	}

	renderTree(node, filter) {
		if (!node.isTopic() || node.isBeyondLevel()) {
			return null;
		}

		const { onSelectNode } = this.props;
		const { type, children } = node;

		const filtered = filter && !node.matches(filter, false);
		const branches = (children || [])
			.map(child => this.renderTree(child, filter))
			.filter(x => x);

		const prune = filtered && !branches.length;

		return prune ? null : (
			<div key={node.id} className={cx('toc-tree', type, { filtered })}>
				<Node
					node={node}
					filtered={filtered}
					highlight={filter}
					onSelectNode={onSelectNode}
					root={this.root}
				/>
				{branches}
			</div>
		);
	}
}
