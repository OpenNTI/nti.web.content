import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	root: 'Readings'
}

const t = scoped('CONTENT-EDITOR-NAVBAR-BREADCRUMB', DEFAULT_TEXT);

export default function Breadcrumb () {
	return (
		<div className="editor-navbar-breadcrumb breadcrumb">
			<span className="root">{t('root')}</span>
		</div>
	);
}
