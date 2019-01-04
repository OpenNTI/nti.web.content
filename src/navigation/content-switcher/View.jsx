import React from 'react';
import PropTypes from 'prop-types';
import {EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Store from './Store';
import ActiveItem from './components/ActiveItem';
import RecentItems from './components/RecentItems';

const t = scoped('content.navigation.content-switcher.View', {
	empty: 'No Recent Content',
	recentLabel: 'Content'
});

@Store.connect(['items'])
class ContentSwitcher extends React.Component {
	static setActiveContent = Store.setActiveContent
	static updateContent = Store.updateContent

	static propTypes = {
		items: PropTypes.array
	}


	render () {
		const {items} = this.props;
		const empty = !items || !items.length;

		return (
			<div className="content-navigation-content-switcher">
				{empty && this.renderEmptyState()}
				{!empty && this.renderItems(items)}
			</div>
		);
	}

	renderEmptyState () {
		return (
			<EmptyState subHeader={t('empty')} />
		);
	}


	renderItems (items) {
		const active = items[0];
		const recent = items.slice(1);

		return (
			<div className="recent-content">
				{active && (<ActiveItem item={active} />)}
				{recent && (<RecentItems items={recent} />)}
			</div>
		);
	}
}


export default ContentSwitcher;
