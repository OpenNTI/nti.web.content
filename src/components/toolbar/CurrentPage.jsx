import React from 'react';
import PropTypes from 'prop-types';
import {Input, VisibleComponentTracker} from '@nti/web-commons';

export default class CurrentPage extends React.Component {
	static propTypes = {
		pageSource: PropTypes.shape({
			getPageNumber: PropTypes.func.isRequired,
			getAllPages: PropTypes.func,
			getRouteForPage: PropTypes.func
		}).isRequired,
		doNavigation: PropTypes.func
	}

	state = {}


	componentDidMount () {
		this.setupFor(this.props);

		const {pageSource} = this.props;

		if (pageSource.getAllPages) {
			VisibleComponentTracker.addGroupListener('real-page-numbers', this.onVisibleChange);
		}
	}


	componentWillUnmount () {
		const {pageSource} = this.props;

		if (pageSource.getAllPages) {
			VisibleComponentTracker.removeGroupListener('real-page-numbers', this.onVisibleChange);
		}
	}


	componentDidUpdate (prevProps) {
		const {pageSource} = this.props;
		const {pageSource:prevPageSource} = this.props;

		if (pageSource !== prevPageSource) {
			this.setupFor(this.props);
		}
	}


	setupFor (props = this.props) {
		const {pageSource} = this.props;

		this.setState({
			currentPage: pageSource.getPageNumber()
		});
	}


	onVisibleChange = (visible) => {
		const page = visible && visible[0] && visible[0].data.pageNumber;

		if (page) {
			this.setState({
				currentPage: page
			});
		}
	}


	selectPage = (value) => {
		const {pageSource, doNavigation} = this.props;
		const route = pageSource.getRouteForPage(value);

		if (doNavigation) {
			doNavigation(route.title, route.href);
		}
	}


	render () {
		const {pageSource} = this.props;

		return (
			<div className="nti-content-toolbar-current-page">
				{pageSource.getAllPages ? this.renderAllPages(pageSource) : this.renderSinglePage(pageSource)}
			</div>
		);
	}


	renderSinglePage (pageSource) {
		return (
			<span className="current-page">{pageSource.getPageNumber()}</span>
		);
	}


	renderAllPages (pageSource) {
		const {currentPage} = this.state;
		const pages = pageSource.getAllPages();

		return (
			<Input.Select className="page-select" optionsClassName="page-select-options-list" value={currentPage} searchable onChange={this.selectPage}>
				{pages.map((page, key) => (<Input.Select.Option key={key} value={page}>{page}</Input.Select.Option>))}
			</Input.Select>
		);
	}
}
