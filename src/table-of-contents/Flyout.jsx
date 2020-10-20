import './Flyout.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from '@nti/web-commons';

import TableOfContents from './View';

export default class TableOfContentsFlyout extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		onSelectNode: PropTypes.func,
		searchResultsCmp: PropTypes.any,
	}


	attachFlyoutRef = x => this.flyout = x;


	onSelectNode = (node) => {
		const {onSelectNode} = this.props;

		if (onSelectNode) {
			onSelectNode(node);
		}

		if (this.flyout) {
			this.flyout.dismiss();
		}
	}

	render () {
		const {contentPackage, onSelectNode} = this.props;

		if (!contentPackage) { return null; }

		return (
			<Flyout.Triggered
				trigger={this.renderTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				ref={this.attachFlyoutRef}
				className="table-of-contents-flyout"
			>
				<div>
					<TableOfContents {...this.props} onSelectNode={onSelectNode && this.onSelectNode} />
				</div>
			</Flyout.Triggered>
		);
	}


	renderTrigger () {
		return (
			<div className="table-of-contents-flyout-trigger">
				<div className="icon" />
				<div className="label">Label</div>
			</div>
		);
	}
}
