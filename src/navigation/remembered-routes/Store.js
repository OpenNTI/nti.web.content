import {Stores, Interfaces} from '@nti/lib-store';
import {getAppUserScopedStorage} from '@nti/web-client';
import {Layouts} from '@nti/web-commons';

import {addRouteAtPath, getRouteAtPath} from './utils';

function Storage () {
	let storage;

	return {
		read: (key) => {
			storage = storage || getAppUserScopedStorage();

			const value = storage.getItem(key);

			try {
				const json = JSON.parse(value);

				return json;
			} catch (e) {
				return {};
			}
		},
		write: (key, value) => {
			storage = storage || getAppUserScopedStorage();

			return storage.setItem(key, JSON.stringify(value));
		}
	};
}

const getKey = () => Layouts.Responsive.isMobileContext() ? 'recent-mobile-routes' : 'recent-routes';

export default
@Interfaces.Stateful(getKey, ['routes'], Storage())
class RecentRoutes extends Stores.SimpleStore {
	static Singleton = true

	static setRouteToRemember (...args) {
		const store = RecentRoutes.getStore();

		return store.setRouteToRemember(...args);
	}


	static getRememberedRoute (...args) {
		const store = RecentRoutes.getStore();

		return store.getRememberedRoute(...args);
	}


	/**
	 * Set a recent route to be retrieved later
	 *
	 * Ex: ['course', '{NTIID}', 'lessons'], path/to/remembered/lesson/route
	 *
	 * @param {[String]} path  the path to store the route
	 * @param {String} route the route to store
	 * @returns {void}
	 */
	setRouteToRemember (path, route) {
		this.set({
			routes: addRouteAtPath(this.get('routes'), path, route) 
		});
	}


	/**
	 * Get a recent route
	 *
	 * @param  {[String]} path the path to retrieve the route from
	 * @return {String}      the route that was stored
	 */
	getRememberedRoute (path) {
		return getRouteAtPath(this.get('routes'), path);
	}
}