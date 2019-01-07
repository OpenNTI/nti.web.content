import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

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

@mixin(Mixins.Stateful)
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
			await this.stateInitialized;
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
			await this.stateInitialized;
			const items = await updateData(this.get('items'), content, route);

			this.set({
				items: trimItems(items)
			});
		} catch (e) {
			//swallow
		}
	}
}

export default ContentSwitcherStore;
