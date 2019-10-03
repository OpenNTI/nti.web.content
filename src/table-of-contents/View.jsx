import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {
	Banner,
	Error as Err,
	Layouts,
	Loading,
	Search,
	Tabs
} from '@nti/web-commons';
import {buffer} from '@nti/lib-commons';

import {RememberedRoutes} from '../navigation';


import TableOfContents from './TableOfContents';

const t = scoped('content.table-of-contents.View', {
	continueReading: 'Continue Reading'
});

export default class TableOfContentsView extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
		banner: PropTypes.bool,
		showLastPage: PropTypes.bool,
		onSelectNode: PropTypes.func
	}

	state = {loading: true}

	tabs = [
		{
			label: 'Table of Contents',
			component: () => (
				<>
					{this.renderError()}
					{this.renderTocs()}
					{this.renderLastPage()}
				</>
			)
		},
		{
			label: 'Search Results',
			component: () => {
				const {searchResultsCmp: Cmp} = this.props;
				const {searchResults: {Items: items = []} = {}} = this.state;

				return !items.length ? null : (
					<div className="toc-search-results">
						<Layouts.InfiniteScroll.Continuous loadMore={this.loadMoreSearchResults} buffer={100}>
							<Cmp hits={items} />
						</Layouts.InfiniteScroll.Continuous>
					</div>
				);
			}
		},
	]


	componentWillReceiveProps (nextProps) {
		const {contentPackage:nextPack} = nextProps;
		const {contentPackage:prevPack} = this.props;

		if (nextPack !== prevPack) {
			this.fillIn(nextProps);
		}
	}


	componentDidMount () {
		this.fillInTocs(this.props);
	}


	async fillInTocs (props = this.props) {
		this.setState({loading: true, error: false});

		const {contentPackage} = props;

		try {
			const tocs = await contentPackage.getTablesOfContents();

			this.setState({loading: false, tocs});
		} catch (e) {
			this.setState({error: e});
		}

	}


	get searchDataSource () {
		const {contentPackage} = this.props;
		const bundle = contentPackage.parent({
			test: o => o.getSearchDataSource
		});
		return bundle ? bundle.getSearchDataSource() : null;
	}


	updateSearch = buffer(500, async term => {
		const shouldSearch = !this.searchInFlight && (term || '').length > 3;
		try {
			this.searchInFlight = true;
			const searchResults = shouldSearch
				? await this.searchDataSource.loadPage( 0, { term })
				: undefined;
	
			this.setState({
				searchResults
			});
		}
		finally {
			delete this.searchInFlight;
		}
	})

	loadMoreSearchResults = buffer(500, async () => {
		const {state: {searchResults}, searchInFlight} = this;
		if (searchResults && searchResults.hasMore && !searchInFlight) {
			const {Items: previousItems = []} = searchResults;
			this.searchInFlight = true;
			try {
				const {Items: items = [], ...result} = await searchResults.loadNextPage();
				
				this.setState({
					searchResults: {
						...result,
						Items: [...previousItems, ...items]
					}
				});
			}
			finally {
				this.searchInFlight = false;
			}
		}
	})

	updateFilter = (filter) => {
		this.setState({filter});
		this.updateSearch(filter);
	}

	onTabChange = activeTab => this.setState({activeTab})


	renderTabs = () => {
		const {activeTab} = this.state;

		return (
			<Tabs.Tabs active={activeTab} onChange={this.onTabChange}>
				{this.tabs.map(({label}) => (
					<Tabs.Tab key={label} label={label} />
				))}
			</Tabs.Tabs>
		);
	}

	renderTabContent = () => {
		const {activeTab = 0} = this.state;
		const {component: Cmp} = this.tabs[activeTab];
		return (
			<Tabs.TabContent active>
				<Cmp />
			</Tabs.TabContent>
		);
	}

	render () {
		const {showLastPage} = this.props;
		const {loading} = this.state;

		return (
			<div className={cx('table-of-contents-view', {loading, 'show-last-page': showLastPage})}>
				{loading && (<Loading.Mask />)}
				{!loading && this.renderBranding()}
				{!loading && this.renderSearch()}
				{!loading && this.renderTabs()}
				{!loading && this.renderTabContent()}
			</div>
		);
	}


	renderError () {
		const {error} = this.state;

		return !error ? null : (<Err error={error} />);
	}


	renderBranding () {
		const {banner, contentPackage} = this.props;

		return !banner ?
			null :
			(
				<Banner item={contentPackage} className="head">
					<div className="branding" />
				</Banner>
			);
	}


	renderSearch () {
		return (
			<Search onChange={this.updateFilter} />
		);
	}


	renderTocs () {
		const {onSelectNode} = this.props;
		const {tocs, filter} = this.state;
		const isSingle = tocs.length === 1;
		const cls = cx({'single-root': isSingle, 'multi-root': !isSingle});

		return (
			<ul className="contents">
				{tocs.map((toc, key) => {
					return (
						<li key={key}>
							<h1 className={cls}>Package: {toc.title}</h1>
							<TableOfContents toc={toc} filter={filter} onSelectNode={onSelectNode} />
						</li>
					);
				})}
			</ul>
		);
	}


	renderLastPage () {
		const {showLastPage, contentPackage} = this.props;

		if (!showLastPage) { return null; }

		const rememberedRoute = RememberedRoutes.getRememberedRoute([contentPackage, 'content']);

		if (!rememberedRoute) { return null;}


		return (
			<div className="last-page-container">
				<a href={rememberedRoute} className="last-page">
					<span className="bookmark-icon" />
					<span className="continue-label">{t('continueReading')}</span>
					<i className="icon-chevron-right arrow" />
				</a>
			</div>
		);
	}
}
