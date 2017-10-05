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

function convertRealPageToNode (realPage) {
	const {page, node} = realPage;


	return {
		type: 'part',
		title: t('realPageTitle', {page}),
		page,
		id: node.id,
		idx: node.idx,
		length: node.length,
		children: node.children
	};
}

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
			<Tree node={toc.root} filter={filter} doNavigation={doNavigation} />
			{hasRealPages && (<div className="label">{t('realPages')}</div>)}
			{hasRealPages && (
				<div className="real-pages">
					{realPages.map((page, index) => {
						return (
							<Node key={index} node={convertRealPageToNode(page)} doNavigation={doNavigation} />
						);
					})}
				</div>
			)}
		</div>
	);
}
