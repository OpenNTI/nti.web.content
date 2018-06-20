import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@nti/web-commons';

export default class CurrentPage extends React.Component {
	static propTypes = {
		pageSource: PropTypes.shape({
			getPageNumber: PropTypes.func.isRequired,
			getAllPages: PropTypes.func,
			getRouteForPage: PropTypes.func
		}).isRequired,
		doNavigation: PropTypes.func
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
		const current = pageSource.getPageNumber();
		const pages = pageSource.getAllPages();

		return (
			<Input.Select className="page-select" optionsClassName="page-select-options-list" value={current} searchable onChange={this.selectPage}>
				{pages.map((page, key) => (<Input.Select.Option key={key} value={page}>{page}</Input.Select.Option>))}
			</Input.Select>
		);
	}
}
