import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from 'nti-lib-locale';

import BreadcrumbItem from './BreadcrumbItem';

const DEFAULT_TEXT = {
	root: 'Readings'
};

const t = scoped('nti-content.editor.content-editor.nav-bar.Breadcrumb', DEFAULT_TEXT);

Breadcrumb.propTypes = {
	gotoResources: PropTypes.func,
	breadcrumb: PropTypes.array
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
