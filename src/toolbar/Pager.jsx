import './Pager.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import Logger from '@nti/util-logger';

import CurrentPage from './CurrentPage';
import Control from './Control';

const t = scoped('content.toolbar.Toolbar', {
	separator: ' of ',
});
const logger = Logger.get('lib:content-toolbar:Pager');

export default class Pager extends React.Component {
	static propTypes = {
		// TODO: The pager should only take a pageSource prop.
		// We can make a PageSource factory on `content.Package`/Bundle (in lib-interfaces) that returns the
		// pageSource for the currentPage (given a pageId... it can return a traditional pageSource or a
		// RealPageAugmentedPageSource -- name is a wip :P )
		contentPackage: PropTypes.shape({
			getTablesOfContents: PropTypes.func,
		}),
		rootId: PropTypes.string.isRequired,
		currentPage: PropTypes.string,
	};

	state = {
		loading: true,
	};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		if (this.props.currentPage !== prevProps.currentPage) {
			this.setup();
		}
	}

	setup = async () => {
		this.setState({ loading: true });

		const { contentPackage, rootId, currentPage } = this.props;

		// TODO: These computations belong in a PageSource. We should create a new model called something like
		// ReapPageNumberPageSource. Where the existing PageSource interface falls short, we should extend it...
		// I Really want to keep one component for paging... and keep logic like this in models.

		try {
			const cPackage = await contentPackage;
			const tocs =
				(cPackage || {}).getTablesOfContents &&
				(await cPackage.getTablesOfContents());

			const toc = tocs && tocs.filter(x => x.getNode(rootId))[0];
			const page = toc && toc.getPageSource(rootId);
			const context = page && page.getPagesAround(currentPage);

			const { realPageIndex } = toc || {};
			const { index, total, next, prev } = context || {};

			const allPages = realPageIndex && realPageIndex.NTIIDs[rootId];

			this.setState({
				total: realPageIndex ? allPages[allPages.length - 1] : total,
				currentPage: realPageIndex
					? realPageIndex.NTIIDs[currentPage][0]
					: index + 1,
				next,
				prev,
				allPages: realPageIndex
					? allPages.map(rp => toc.getRealPage(rp))
					: null,
				toc,
				loading: false,
			});
		} catch (error) {
			logger.error(error);
			this.setState({ loading: false, error: true });
		}
	};

	render() {
		const {
			currentPage,
			allPages,
			total,
			loading,
			next,
			prev,
			toc,
		} = this.state;

		if (loading) {
			return <Loading.Spinner />;
		}

		if (!prev && !next) {
			return null;
		}

		return (
			<div className="pager-controls">
				<div className="page">
					<CurrentPage
						currentPage={currentPage}
						allPages={allPages}
						toc={toc}
					/>
					<span className="separator">{t('separator')}</span>
					<span className="total">{total}</span>
				</div>
				<Control
					cxt="previous-page"
					obj={prev}
					className="prev"
					allPages={allPages}
				/>
				<Control
					cxt="next-page"
					obj={next}
					className="next"
					allPages={allPages}
				/>
			</div>
		);
	}
}
