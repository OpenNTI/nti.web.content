import StorePrototype from 'nti-lib-store';
import {Errors} from 'nti-web-commons';
import Logger from 'nti-util-logger';

import {
	SAVING,
	SAVE_ENDED,
	SET_ERROR
} from './Constants';

const logger = Logger.get('lib:content-editor:Store');

const {Field: {Factory:ErrorFactory}} = Errors;
const errorFactory = new ErrorFactory();

const SHORT = 3000;

const Protected = Symbol('Protected');
const ErrorMessages = 'error-messages';

const SetSaveStart = Symbol('SetSaveStart');
const SetSaveEnd = Symbol('SetSaveEnd');
const SetError = Symbol('SetError');

const SetMessage = Symbol('SetMessage');
const GetMessage = Symbol('GetMessage');
const RemoveMessage = Symbol('RemoveMessage');


class Store extends StorePrototype {
	constructor () {
		super();

		this[Protected] = {
			savingCount: 0,
			[ErrorMessages]: []
		};

		this.registerHandlers({
			[SAVING]: SetSaveStart,
			[SAVE_ENDED]: SetSaveEnd,
			[SET_ERROR]: SetError
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


	[GetMessage] (messageCategory, id, field) {
		const messages = this[Protected][messageCategory];

		for (let message of messages) {
			if (message.isAttachedTo(id, field)) { return message; }
		}
	}


	[RemoveMessage] (messageCategory, id, field, type) {
		let messages = this[Protected][messageCategory];

		this[Protected][messageCategory] = messages.filter(x => !x.isAttachedTo(id, field));

		this.emitChange({type, NTIID: id});

		return messages;
	}


	[SetMessage] (messageCategory, message, type) {
		const messages = this[Protected][messageCategory];
		const {NTIID, field, label, reason} = message;

		if (!this[GetMessage](messageCategory, NTIID, field)) {
			const newMessage = errorFactory.make(
				{NTIID, field, type, label},
				reason,
				() => this[RemoveMessage](messageCategory, NTIID, field, type)
			);

			messages.push(newMessage);

			this.emitChange({type, NTIID});
		}

		return messages;
	}


	[SetError] (e) {
		const {response} = e.action;
		const {type} = response || {};

		//Note: Do not show 409s.
		//since the user deals with them directly through a modal dialog
		if (!response || response.statusCode !== 409) {
			this[SetMessage](ErrorMessages, response, type || SET_ERROR);
		}
	}


	getErrorFor (id, field) {
		return this[GetMessage](ErrorMessages, id, field);
	}
}

export default new Store();
