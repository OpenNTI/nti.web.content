import EventEmitter from 'events';

const STATE = Symbol('State');

export default class PluginStore extends EventEmitter {
	constructor (initialState = {}) {
		super();
		this.setMaxListeners(1000);

		this[STATE] = initialState;
	}


	get state () {
		return this[STATE];
	}


	getItem (key) {
		return this[STATE][key];
	}


	setItem (key, value) {
		const oldValue = this.getItem(key);

		this[STATE][key] = value;

		if (oldValue !== value) {
			this.emit(`${key}-changed`, value);
		}

		return value;
	}
}

export function createStore (initialState) {
	return new PluginStore(initialState);
}
