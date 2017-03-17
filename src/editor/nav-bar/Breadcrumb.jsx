import React from 'react';
import {scoped} from 'nti-lib-locale';

import BreadcrumbItem from './BreadcrumbItem';

const DEFAULT_TEXT = {
	root: 'Readings'
};

const t = scoped('CONTENT-EDITOR-NAVBAR-BREADCRUMB', DEFAULT_TEXT);

Breadcrumb.propTypes = {
	gotoResources: React.PropTypes.func,
	breadcrumb: React.PropTypes.array
};

export default function Breadcrumb ({gotoResources, breadcrumb}) {
	breadcrumb = breadcrumb || [
		{
			label: t('root'),
			handleRoute: gotoResources
		}
	];

	return (
		<div className="editor-navbar-breadcrumb breadcrumb">
			{breadcrumb.map((x, index) => {
				return (
					<BreadcrumbItem key={index} item={x} />
				);
			})}
		</div>
	);
}
