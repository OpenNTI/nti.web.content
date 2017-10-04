import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Tree from './Tree';
import RealPage from './RealPage';

const DEFAULT_TEXT = {
	toc: 'Table of Contents',
	realPages: 'Jump to Page'
};

const t = scoped('nti-content.table-of-contents.toc', DEFAULT_TEXT);

TableOfContents.propTypes = {
	toc: PropTypes.object.isRequired,
	filter: PropTypes.string,
	doNavigation: PropTypes.func
};
export default function TableOfContents ({toc, filter, doNavigation}) {
	const realPages = toc.getRealPages ? toc.getRealPages(filter) : [];
	const hasRealPages = realPages.length > 0;

	return (
		<div className="table-of-contents">
			{hasRealPages && (<div className="label">{t('toc')}</div>)}
			<Tree node={toc.root} filter={filter} />
			{hasRealPages && (<div className="label">{t('realPages')}</div>)}
			{hasRealPages && (
				<div className="real-pages">
					{realPages.map((page, index) => {
						return (
							<RealPage key={index} page={page} doNavigation={doNavigation} />
						);
					})}
				</div>
			)}
		</div>
	);
}
