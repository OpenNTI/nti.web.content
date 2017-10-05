import React from 'react';
import PropTypes from 'prop-types';
import { Flyout } from 'nti-web-commons';

import TableOfContents from './View';

export default class TableOfContentsFlyout extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		doNavigation: PropTypes.func
	}


	attachFlyoutRef = x => this.flyout = x;


	doNavigation = (node) => {
		const {doNavigation} = this.props;

		if (doNavigation) {
			doNavigation(node);
		}

		if (this.flyout) {
			this.flyout.dismiss();
		}
	}

	render () {
		const {contentPackage, doNavigation} = this.props;

		if (!contentPackage) { return null; }

		return (
			<Flyout.Triggered
				trigger={this.renderTrigger()}
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				ref={this.attachFlyoutRef}
				className="table-of-contents-flyout"
			>
				<div>
					<TableOfContents contentPackage={contentPackage} doNavigation={doNavigation && this.doNavigation} />
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
