import React from 'react';
import PropTypes from 'prop-types';
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
		rememberNonRootRoutes: true,
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

BookTabs.propTypes = {
	excludeTabs: PropTypes.array
};
export default function BookTabs ({excludeTabs, ...props}) {
	const tabs = TABS.filter(tab => !excludeTabs || excludeTabs.indexOf(tab.id) < 0);

	return (
		<Tabs {...props} tabs={tabs} />
	);
}