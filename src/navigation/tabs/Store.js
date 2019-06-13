import {Stores} from '@nti/lib-store';

import {Root} from './Constants';
import {isRouteActive, isSameRoute} from './utils';


export default class ContentNavigationTabs extends Stores.BoundStore {
	load () {
		const {content, activeRoute, baseRoute, tabs} = this.binding;

		if (content === this.content && activeRoute === this.activeRoute && baseRoute === this.baseRoute && tabs === this.tabs) { return; }

		this.content = content;
		this.activeRoute = activeRoute;
		this.baseRoute = baseRoute;
		this.tabs = tabs;

		this.set({
			tabConfigs: tabs
				.map(tab => this.getTabConfig(tab))
				.filter(Boolean)
		});
	}

	getTabConfig (tab) {
		if (!tab) { return null; }

		const {id, label, aliases, getPathToRemember} = tab;
		const rootRoute = this.binding.getRouteFor(this.content, id);


	}
}