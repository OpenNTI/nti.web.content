import './Pager.scss';
import { useEffect, useReducer } from 'react';
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

PagerOfTheReal.propTypes = {
	// TODO: The pager should only take a pageSource prop.
	// We can make a PageSource factory on `content.Package`/Bundle (in lib-interfaces) that returns the
	// pageSource for the currentPage (given a pageId... it can return a traditional pageSource or a
	// RealPageAugmentedPageSource -- name is a wip :P )
	contentPackage: PropTypes.shape({
		getTablesOfContents: PropTypes.func,
	}),
	rootId: PropTypes.string,
	currentPage: PropTypes.string,
};

export default function PagerOfTheReal({
	contentPackage,
	rootId,
	currentPage: currentPageAround,
}) {
	const [
		{ currentPage, allPages, total, loading, next, prev, toc },
		setState,
	] = useReducer((state, action) => ({ ...state, ...action }), {
		loading: true,
	});

	useEffect(() => {
		const task = { current: true };
		const save = data => task.current && setState(data);

		(async () => {
			try {
				save(
					await load(task, contentPackage, rootId, currentPageAround)
				);
			} catch (error) {
				logger.error(error);
				save({ error: true });
			} finally {
				save({ loading: false });
			}
		})();

		return () => {
			task.current = false;
		};
	}, [contentPackage, rootId, currentPageAround]);

	return loading ? (
		<Loading.Spinner />
	) : !prev && !next ? null : (
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

async function load(task, contentPackage, rootId, currentPage) {
	// TODO: These computations belong in a PageSource. We should create a new model called something like
	// ReapPageNumberPageSource. Where the existing PageSource interface falls short, we should extend it...
	// I Really want to keep one component for paging... and keep logic like this in models.

	if (!task.current) return;

	const pkg = await contentPackage;

	if (!task.current) return;

	const tocs = await pkg?.getTablesOfContents?.();

	if (!task.current || !pkg || !rootId || currentPage == null) {
		return;
	}

	const toc = tocs?.filter(x => x.getNode(rootId))[0];
	const page = toc?.getPageSource(rootId);
	const context = page?.getPagesAround(currentPage);

	const { realPageIndex } = toc || {};
	const { index, total, next, prev } = context || {};

	const allPages = realPageIndex && realPageIndex.NTIIDs[rootId];

	return {
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
	};
}
