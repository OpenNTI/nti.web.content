import {Stores, Interfaces} from '@nti/lib-store';
import {decorate} from '@nti/lib-commons';
import {getAppUserScopedStorage} from '@nti/web-client';

import {insertInto, updateData} from './switcher-data';

const MAX_SIZE = 5;

function trimItems (items) {
	const counts = {};
	const trimmed = [];

	for (let item of items) {
		const {type} = item;

		if (!counts[type]) { counts[type] = 1; }
		else { counts[type]++; }

		if (counts[type] <= MAX_SIZE) {
			trimmed.push(item);
		}
	}

	return trimmed;
}

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

class ContentSwitcherStore extends Stores.SimpleStore {
	static Singleton = true

	static setActiveContent (...args) {
		const store = ContentSwitcherStore.getStore();

		store.setActiveContent(...args);
	}

	static updateContent (...args) {
		const store = ContentSwitcherStore.getStore();

		store.updateContent(...args);
	}

	StatefulProperties = ['items']
	StateKey = 'content-switcher'
	PersistState = true


	async setActiveContent (content, route) {
		try {
			const items = await insertInto(this.get('items'), content, route);

			this.set({
				items: trimItems(items)
			});
		} catch (e) {
			//swallow
		}
	}


	async updateContent (content, route) {
		try {
			const items = await updateData(this.get('items'), content, route);

			this.set({
				items: trimItems(items)
			});
		} catch (e) {
			//swallow
		}
	}
}

export default decorate(ContentSwitcherStore, [
	Interfaces.Stateful('content-switcher', ['items'], Storage())
]);
