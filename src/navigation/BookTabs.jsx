import React from 'react';
import {scoped} from '@nti/lib-locale';

import Tabs from './tabs';

const t = scoped('content.navigation.BookTabs', {
	content: 'Book',
	discussions: 'Discussions',
	notebook: 'Notebook'
});

const OBJECT_REGEX = /\/object.*$/;
const stripObject = route => route.replace(OBJECT_REGEX, '');

const TABS = [
	{
		id: 'content',
		label: t('content'),
		isRoot: true,
		getPathToRemember: (route) => {
			return stripObject(route);
		}
	},
	{
		id: 'discussions',
		label: t('discussions'),
		shouldShowFor: book => book.hasLink('DiscussionBoard')
	},
	{
		id: 'notebook',
		label: t('notebook')
	}
];

export default function BookTabs (props) {
	return (
		<Tabs {...props} tabs={TABS} />
	);
}