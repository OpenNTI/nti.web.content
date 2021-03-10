import './TableOfContents.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Tree from './Tree';
import Node from './Node';

const DEFAULT_TEXT = {
	toc: 'Table of Contents',
	realPages: 'Jump to Page',
	realPageTitle: 'Page %(page)s',
};

const t = scoped('web-content.table-of-contents.toc', DEFAULT_TEXT);

function buildFakeNodeForPage(realPage) {
	const { page, NTIID, NavNTIID } = realPage;

	if (!NavNTIID || !NTIID) {
		return null;
	}

	const navParts = NavNTIID.split('#');
	const isFragment = navParts.length > 1;

	return {
		type: 'part',
		id: NTIID,
		parent: !isFragment
			? null
			: {
					id: navParts[0],
					getAttribute(attr) {
						if (attr === 'href') {
							return navParts[0];
						}
					},
			  },
		isAnchor() {
			return navParts.length > 1;
		},
		getAnchorTarget() {
			return navParts[1];
		},
		title: t('realPageTitle', { page }),
		getAttribute(attr) {
			if (attr === 'href') {
				return NavNTIID;
			}
		},
		children: [],
	};
}

TableOfContents.propTypes = {
	toc: PropTypes.object.isRequired,
	filter: PropTypes.string,
	onSelectNode: PropTypes.func,
};
export default function TableOfContents({ toc, filter, onSelectNode }) {
	const realPages = toc.getRealPages ? toc.getRealPages(filter) : [];
	const hasRealPages = realPages.length > 0;
	const { root } = toc;

	return (
		<div className="table-of-contents">
			{hasRealPages && <div className="toc-label">{t('toc')}</div>}
			<Tree node={root} filter={filter} onSelectNode={onSelectNode} />
			{hasRealPages && <div className="toc-label">{t('realPages')}</div>}
			{hasRealPages && (
				<div className="real-pages">
					{realPages.map((realPage, index) => {
						const node = buildFakeNodeForPage(realPage);
						const { id: rootId } = root || {};

						if (!node) {
							return null;
						}

						return (
							<Node
								key={index}
								root={rootId}
								node={node}
								onSelectNode={onSelectNode}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
