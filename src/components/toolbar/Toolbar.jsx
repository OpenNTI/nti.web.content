import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from './Breadcrumb';
import TableOfContents from './TableOfContents';

export default class Toolbar extends React.Component {
	static propTypes = {
		path: PropTypes.any,
		pageSource: PropTypes.any,
		toc: PropTypes.object,
		hideControls: PropTypes.bool,
		hideHeader: PropTypes.bool,
		doNavigation: PropTypes.func
	}

	constructor (props) {
		super(props);

		const { path, pageSource, toc } = props;

		this.state = {
			path: []
		};

		Promise.all([
			path,
			pageSource,
			toc
		]).then((results) => {
			this.setState({
				path: results[0],
				pageSource: results[1],
				toc: results[2]
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
				<span className="currentPage">{this.state.pageSource.getPageNumber() + 1}
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

		const className = 'prev' + (pageSource && pageSource.getPrevious() ? '' : ' disabled');

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

		const className = 'next' + (pageSource && pageSource.getNext() ? '' : ' disabled');

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

		return (
			<div className="path-items">
				<TableOfContents toc={this.state.toc} doNavigation={this.props.doNavigation}/>
				<Breadcrumb onClick={this.onBreadcrumbItemClicked} items={this.state.path}/>
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
