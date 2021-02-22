import { Stores } from '@nti/lib-store';

import RememberedRoutesStore from '../remembered-routes';

import { isRouteActive, isSameRoute } from './utils';

const ROUTE_CACHE = {};

const setRouteCache = (root, route) => (ROUTE_CACHE[root] = route);
const getRouteCache = root => ROUTE_CACHE[root] || root;

export default class ContentNavigationTabs extends Stores.BoundStore {
	load() {
		const { content, activeRoute, baseRoute, tabs } = this.binding;

		if (
			content === this.content &&
			activeRoute === this.activeRoute &&
			baseRoute === this.baseRoute &&
			tabs === this.tabs
		) {
			return;
		}

		this.content = content;
		this.activeRoute = activeRoute;
		this.baseRoute = baseRoute;
		this.tabs = tabs;

		this.set({
			tabConfigs: tabs
				.filter(tab => !tab.shouldShowFor || tab.shouldShowFor(content))
				.map(tab => this.getTabConfig(tab))
				.filter(Boolean),
		});
	}

	getTabConfig(tab) {
		if (!tab) {
			return null;
		}

		const { activeRoute, baseRoute, content, getRouteFor } = this.binding;
		const { id, label, aliases, isRoot } = tab;
		const tabRoot = getRouteFor(content, id);

		const isActive =
			isRouteActive(tabRoot, activeRoute) ||
			(isRoot && isSameRoute(activeRoute, baseRoute));
		const isAliasActive =
			(aliases || []).filter(alias =>
				isRouteActive(getRouteFor(content, alias))
			).length > 0;
		const isTabRoot = isSameRoute(tabRoot, activeRoute);

		let route = null;

		if (isActive || isAliasActive) {
			setRouteCache(tabRoot, activeRoute);
			route = tabRoot;

			this.maybeRemember(tab, isTabRoot);
		} else {
			route = getRouteCache(tabRoot);
		}

		return {
			id,
			label,
			route,
			active: isActive || isAliasActive,
		};
	}

	maybeRemember(tab, isTabRoot) {
		if (!tab) {
			return null;
		}

		const { activeRoute, content } = this.binding;
		const { getPathToRemember, rememberNonRootRoutes } = tab;
		const toRemember = getPathToRemember
			? getPathToRemember(activeRoute)
			: activeRoute;

		RememberedRoutesStore.setRouteToRemember([content], toRemember);

		if (rememberNonRootRoutes && !isTabRoot) {
			RememberedRoutesStore.setRouteToRemember(
				[content, tab.id],
				toRemember
			);
		}
	}
}
