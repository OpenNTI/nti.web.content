import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	types: 'Types'
};

const t = scoped('nti-content.editor.content-editor.sidebar.TabBar', DEFAULT_TEXT);

export default function TabBar () {
	return (
		<div className="content-editor-sidebar-tabbar">
			<div className="tab active">{t('types')}</div>
			<div className="tab" />
		</div>
	);
}
