import StorePrototype from 'nti-lib-store';
// import {Errors} from 'nti-web-commons';
import Logger from 'nti-util-logger';

import {
	SAVING,
	SAVE_ENDED
} from './Constants';

const logger = Logger.get('lib:content-editor:Store');

// const {Field: {Factory:ErrorFactory}} = Errors;
// const errorFactory = new ErrorFactory();

const SHORT = 3000;

const Protected = Symbol('Protected');

const SetSaveStart = Symbol('SetSaveStart');
const SetSaveEnd = Symbol('SetSaveEnd');

class Store extends StorePrototype {
	constructor () {
		super();

		this[Protected] = {
			savingCount: 0
		};

		this.registerHandlers({
			[SAVING]: SetSaveStart,
			[SAVE_ENDED]: SetSaveEnd
		});
	}

	[SetSaveStart] () {
		const {savingCount:oldCount, endSavingTimeout} = this[Protected];

		clearTimeout(endSavingTimeout);

		this[Protected].savingCount += 1;
		this[Protected].lastSaveStart = new Date();

		if (oldCount === 0) {
			this.emitChange({type: SAVING});
		}
	}


	[SetSaveEnd] () {
		const {savingCount:oldCount, lastSaveStart, endSavingTimeout} = this[Protected];
		const newCount = Math.max(0, oldCount - 1);
		const maybeEnd = () => {
			if (this[Protected].savingCount === 0) {
				this.emitChange({type: SAVING});
			}
		};

		if (oldCount === 0) {
			logger.warn('SaveEnded called more times than SaveStarted');
		}

		this[Protected].savingCount = newCount;

		if (newCount !== 0) { return; }

		const now = new Date();
		const start = lastSaveStart || new Date(0);
		const savingTime = now - start;

		clearTimeout(endSavingTimeout);

		if (savingTime < SHORT) {
			this[Protected].endSavingTimeout = setTimeout(maybeEnd, SHORT - savingTime);
		} else {
			maybeEnd();
		}
	}
}

export default new Store();
