import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	root: 'Readings'
}

const t = scoped('CONTENT-EDITOR-NAVBAR-BREADCRUMB', DEFAULT_TEXT);

Breadcrumb.propTypes = {
	gotoResources: React.PropTypes.func
};

export default function Breadcrumb ({gotoResources}) {
	return (
		<div className="editor-navbar-breadcrumb breadcrumb">
			<span className="root" onClick={gotoResources}>{t('root')}</span>
		</div>
	);
}
