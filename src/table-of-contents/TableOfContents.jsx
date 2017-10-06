import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import Tree from './Tree';
import Node from './Node';

const DEFAULT_TEXT = {
	toc: 'Table of Contents',
	realPages: 'Jump to Page',
	realPageTitle: 'Page %(page)s'
};

const t = scoped('nti-content.table-of-contents.toc', DEFAULT_TEXT);

TableOfContents.propTypes = {
	toc: PropTypes.object.isRequired,
	filter: PropTypes.string,
	onSelectNode: PropTypes.func
};
export default function TableOfContents ({toc, filter, onSelectNode}) {
	const realPages = toc.getRealPages ? toc.getRealPages(filter) : [];
	const hasRealPages = realPages.length > 0;

	return (
		<div className="table-of-contents">
			{hasRealPages && (<div className="label">{t('toc')}</div>)}
			<Tree node={toc.root} filter={filter} onSelectNode={onSelectNode} />
			{hasRealPages && (<div className="label">{t('realPages')}</div>)}
			{hasRealPages && (
				<div className="real-pages">
					{realPages.map((realPage, index) => {
						const {page, node} = realPage;

						return (
							<Node key={index} node={node} title={t('realPageTitle', {page})} type="part" onSelectNode={onSelectNode} />
						);
					})}
				</div>
			)}
		</div>
	);
}
