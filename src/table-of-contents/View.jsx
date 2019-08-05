import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Search, Loading, Error as Err, Banner} from '@nti/web-commons';

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


	updateFilter = (filter) => {
		this.setState({filter});
	}


	render () {
		const {showLastPage} = this.props;
		const {loading} = this.state;

		return (
			<div className={cx('table-of-contents-view', {loading, 'show-last-page': showLastPage})}>
				{loading && (<Loading.Mask />)}
				{!loading && this.renderBranding()}
				{!loading && this.renderSearch()}
				{!loading && this.renderError()}
				{!loading && this.renderTocs()}
				{!loading && this.renderLastPage()}
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
