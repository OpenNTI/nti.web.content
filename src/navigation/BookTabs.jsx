import React from 'react';
import {scoped} from '@nti/lib-locale';

import Tabs from './tabs';

const t = scoped('content.navigation.BookTabs', {
	content: 'Book',
	discussions: 'Discussions',
	notebook: 'Notebook'
});

const TABS = [
	{
		id: 'content',
		label: t('content'),
		isRoot: true,
		getPathToRemember: () => {
			debugger;
		}
	},
	{
		id: 'discussions',
		label: t('discussions'),
		shouldShowFor: book => book.hasLink('DiscussionBoard'),
		getPathToRemember: () => {
			debugger;
		}
	},
	{
		id: 'notebook',
		label: t('notebook'),
		getPathToRemember: () => {
			debugger;
		}
	}
];

export default function BookTabs (props) {
	return (
		<Tabs {...props} tabs={TABS} />
	);
}