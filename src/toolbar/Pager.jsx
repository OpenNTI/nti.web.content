import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';
import cx from 'classnames';

import CurrentPage from './CurrentPage';

const t = scoped('content.toolbar.Toolbar', {
	separator: ' of '
});

export default class Pager extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.shape({
			getTablesOfContents: PropTypes.func
		}).isRequired,
		rootId: PropTypes.string.isRequired,
		currentPage: PropTypes.string.isRequired,
	}

	state = {
		loading: true
	}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		if (this.props.currentPage !== prevProps.currentPage) {
			this.setup();
		}
	}

	setup = async () => {
		this.setState({ loading: true });

		const { contentPackage, rootId, currentPage } = this.props;

		try {
			const cPackage = await contentPackage;
			const tocs = await cPackage.getTablesOfContents();

			const toc = tocs && tocs.filter(x => x.getNode(rootId))[0];
			const page = toc && toc.getPageSource();
			const context = page && page.getPagesAround(currentPage);

			const { realPageIndex } = toc;
			const { index, total } = context;

			const allPages = realPageIndex && realPageIndex.NTIIDs[rootId];

			this.setState({
				total: 			realPageIndex ? allPages[allPages.length - 1] 			    : total,
				currentPage: 	realPageIndex ? realPageIndex.NTIIDs[currentPage][0] 	    : index + 1,
				next: 			context.next,
				prev:			context.prev,
				allPages: 		realPageIndex ? allPages.map(rp => toc.getRealPage(rp))	: null,
				toc,
				loading: false
			});
		} catch (error) {
			this.setState({ loading: false, error: true });
		}

	}

	render () {
		const { currentPage, allPages, total, loading, next, prev, toc } = this.state;

		if (loading) {
			return <Loading.Spinner />;
		}

		if (!prev && !next) {
			return null;
		}

		const prevClassName = cx('prev', { 'disabled': !prev, 'real-page': allPages });
		const nextClassName = cx('next', { 'disabled': !next, 'real-page': allPages });

		return (
			<div className="pager-controls">
				<div className="page">
					<CurrentPage currentPage={currentPage} allPages={allPages} toc={toc} />
					<span className="separator">{t('separator')}</span>
					<span className="total">{total}</span>
				</div>
				<LinkTo.Object context="previous-page" object={prev}>
					<div className={prevClassName} />
				</LinkTo.Object>
				<LinkTo.Object context="next-page" object={next}>
					<div className={nextClassName} />
				</LinkTo.Object>
			</div>
		);
	}
}
