import React from 'react';
import PropTypes from 'prop-types';

import {Flyout as TocFlyout} from '../../table-of-contents/';

import Breadcrumb from './Breadcrumb';

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
		message: PropTypes.object
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


	renderPage () {
		if(!this.state.pageSource) {
			return null;
		}

		return (
			<div className="page">
				<span className="currentPage">{this.state.pageSource.getPageNumber()}
				</span> of <span className="total">{this.state.pageSource.getTotal()}
				</span>
			</div>
		);
	}

	goToPrevious = () => {
		const { pageSource } = this.state;
		const { doNavigation } = this.props;

		if(pageSource && pageSource.previous) {
			const previous = pageSource.getPrevious(),
				title = pageSource.getPreviousTitle(),
				precache = pageSource.getPreviousPrecache();

			return doNavigation(title, previous, precache);
		}

		return;
	}

	renderPrev () {
		const { pageSource } = this.state;

		const className = 'prev' + (pageSource && pageSource.previous && pageSource.getPrevious() ? '' : ' disabled');

		return (<div onClick={this.goToPrevious} className={className}/>);
	}

	goToNext = () => {
		const { pageSource } = this.state;
		const { doNavigation } = this.props;

		if(pageSource && pageSource.next) {
			const next = pageSource.getNext(),
				title = pageSource.getNextTitle(),
				precache = pageSource.getNextPrecache();

			return doNavigation(title, next, precache);
		}

		return;
	}

	renderNext () {
		const { pageSource } = this.state;

		const className = 'next' + (pageSource && pageSource.next && pageSource.getNext() ? '' : ' disabled');

		return (<div onClick={this.goToNext} className={className}/>);
	}

	renderControls () {
		if(this.props.hideControls) {
			return null;
		}

		return (
			<div className="right controls">
				{this.renderPage()}
				{this.renderPrev()}
				{this.renderNext()}
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
			<div className="content-toolbar">
				<div className="toolbar">
					{this.renderControls()}
					{this.renderHeader()}
				</div>
			</div>
		);
	}
}
