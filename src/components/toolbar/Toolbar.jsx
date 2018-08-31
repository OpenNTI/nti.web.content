import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from './Breadcrumb';
import PagerOfRealPages from '../../toolbar/Pager';
import Pager from './Pager';

import { Flyout as TocFlyout } from '../../table-of-contents/';


export default class Toolbar extends React.Component {
	static propTypes = {
		path: PropTypes.any,
		pageSource: PropTypes.any,
		toc: PropTypes.object,
		contentPackage: PropTypes.object,
		showToc: PropTypes.bool,
		hideControls: PropTypes.bool,
		hideHeader: PropTypes.bool,
		doNavigation: PropTypes.func,
		selectTocNode: PropTypes.func,
		message: PropTypes.object,
		currentPage: PropTypes.string,
		rootId: PropTypes.string
	}

	constructor (props) {
		super(props);

		const { path, pageSource, contentPackage } = props;

		this.state = {
			path: []
		};

		Promise.all([
			path,
			pageSource,
			contentPackage
		]).then((results) => {
			this.setState({
				path: results[0],
				pageSource: results[1],
				contentPackage: results[2]
			});
		});
	}

	onBreadcrumbItemClicked = (item) => {
		const route = item.route,
			precache = item.precache,
			title = item.title;

		this.props.doNavigation && this.props.doNavigation(title, route, precache);
	}

	renderControls () {
		if(this.props.hideControls) {
			return null;
		}

		const { contentPackage, rootId, currentPage, pageSource, doNavigation } = this.props;

		return (
			<div className="right controls">
				{pageSource ? (
					<Pager pageSource={pageSource} doNavigation={doNavigation} />
				) : (
					<PagerOfRealPages
						contentPackage={contentPackage}
						currentPage={currentPage}
						rootId={rootId}
					/>
				)}
			</div>
		);
	}

	renderHeader () {
		if(this.props.hideHeader) {
			return null;
		}

		const {showToc, selectTocNode} = this.props;
		const className = 'path-items' + (this.props.message ? ' show-toast' : '');

		return (
			<div className={className}>
				{showToc && (<TocFlyout contentPackage={this.state.contentPackage} onSelectNode={selectTocNode}/>)}
				<Breadcrumb onClick={this.onBreadcrumbItemClicked} items={this.state.path} message={this.props.message}/>
			</div>
		);
	}

	render () {
		return (
			<div className="nti-content-toolbar content-toolbar">
				<div className="toolbar">
					{this.renderHeader()}
					{this.renderControls()}
				</div>
			</div>
		);
	}
}
