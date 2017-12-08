import StorePrototype from 'nti-lib-store';
import Logger from 'nti-util-logger';
import {Errors} from 'nti-web-commons';
import { scoped } from 'nti-lib-locale';

import {
	SAVING,
	SAVE_ENDED,
	SET_ERROR,
	CLEAR_ALL_ERRORS,
	PRE_PUBLISH,
	PUBLISHING,
	PUBLISH_ENDED,
	UNPUBLISHING,
	UNPUBLISH_ENDED,
	DELETING,
	DELETE_ENDED,
	DELETED,
	RESET_STORE,
	NEW_RENDER_JOB,
	RENDER_JOB_CHANGE,
	EMPTY_CODE_BLOCK
} from './Constants';

const logger = Logger.get('lib:content-editor:Store');

const DEFAULT_TEXT = {
	emptyCodeBlock: 'Code blocks cannot be empty.'
};
const t = scoped('nti-content.editor.Store', DEFAULT_TEXT);

const {Field: {Factory:ErrorFactory}} = Errors;

const errorFactory = new ErrorFactory({
	overrides: {
		'ContentValidationError': reason => {
			if (reason.MimeType === EMPTY_CODE_BLOCK) {
				return t('emptyCodeBlock');
			}

			return reason.message;
		}
	}
});

const SHORT = 3000;

const Protected = Symbol('Protected');
const ErrorMessages = 'error-messages';

const SetSaveStart = Symbol('SetSaveStart');
const SetSaveEnd = Symbol('SetSaveEnd');

const SetError = Symbol('SetError');
const ClearAllErrors = Symbol('ClearAllErrors');

const SetMessage = Symbol('SetMessage');
const GetMessage = Symbol('GetMessage');
const RemoveMessage = Symbol('RemoveMessage');

const SetPrePublish = Symbol('SetPrePublish');
const SetPublishStart = Symbol('SetPublishStart');
const SetPublishEnd = Symbol('SetPublishEnd');

const SetUnpublishStart = Symbol('SetUnpublishStart');
const SetUnpublishEnd = Symbol('SetUnpublishEnd');

const SetDeleteStart = Symbol('SetDeleteStart');
const SetDeleteEnd = Symbol('SetDeleteEnd');
const SetDeleted = Symbol('SetDeleted');

const Reset = Symbol('Reset');

const NewRenderJob = Symbol('NewRenderJob');
const RenderJobChanged = Symbol('RenderJobChanged');

function init (store) {
	store[Protected] = {
		contentEditor: null,
		savingCount: 0,
		publishing: false,
		unpublishing: false,
		hasPublished: false,
		[ErrorMessages]: []
	};
}


class Store extends StorePrototype {
	constructor () {
		super();

		init(this);

		this.registerHandlers({
			[SAVING]: SetSaveStart,
			[SAVE_ENDED]: SetSaveEnd,
			[SET_ERROR]: SetError,
			[CLEAR_ALL_ERRORS]: ClearAllErrors,
			[PRE_PUBLISH]: SetPrePublish,
			[PUBLISHING]: SetPublishStart,
			[PUBLISH_ENDED]: SetPublishEnd,
			[UNPUBLISHING]: SetUnpublishStart,
			[UNPUBLISH_ENDED]: SetUnpublishEnd,
			[DELETING]: SetDeleteStart,
			[DELETE_ENDED]: SetDeleteEnd,
			[DELETED]: SetDeleted,
			[RESET_STORE]: Reset,
			[NEW_RENDER_JOB]: NewRenderJob
		});
	}

	[Reset] () {
		init(this);
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
		const {type, reason} = response || {};

		if (reason && reason.statusCode === 404) {
			return this[SetDeleted]();
		}

		//Note: Do not show 409s.
		//since the user deals with them directly through a modal dialog
		if (!reason || reason.statusCode !== 409) {
			this[SetMessage](ErrorMessages, response, type || SET_ERROR);
		}
	}


	[ClearAllErrors] () {
		this[Protected][ErrorMessages] = [];

		this.emitChange({type: SET_ERROR});
	}

	[SetPrePublish] () {
		this[Protected].prepublish = true;

		this.emitChange({type: PUBLISHING});
	}


	[SetPublishStart] () {
		this[Protected].publishing = true;
		this[Protected].hasPublished = true;

		delete this[Protected].prepublish;

		this.emitChange({type: PUBLISHING});
	}


	[SetPublishEnd] () {
		this[Protected].publishing = false;

		delete this[Protected].prepublish;

		this.emitChange({type: PUBLISHING});
	}


	[SetUnpublishStart] () {
		this[Protected].unpublishing = true;

		this.emitChange({type: UNPUBLISHING});
	}


	[SetUnpublishEnd] () {
		this[Protected].unpublishing = false;

		this.emitChange({type: UNPUBLISHING});
	}


	[SetDeleteStart] () {
		this[Protected].deleting = true;
		this[Protected].hasDeleted = true;

		this.emitChange({type: DELETING});
	}


	[SetDeleteEnd] () {
		this[Protected].deleting = false;

		this.emitChange({type: DELETING});
	}


	[SetDeleted] () {
		this[Protected].deleted = true;

		this.emitChange({type: DELETED});
	}


	[RenderJobChanged] = (renderJob) => {
		if (this[Protected].renderJob !== renderJob) {
			logger.warn('Received render changed for an different render job, dropping it on the floor');
			return;
		}

		this.emitChange({type: RENDER_JOB_CHANGE});
	}


	[NewRenderJob] (e) {
		const {response:newRenderJob} = e.action;
		const {renderJob:oldRenderJob} = this[Protected];

		if (oldRenderJob) {
			oldRenderJob.stopMonitor();
			oldRenderJob.removeListener('change', this[RenderJobChanged]);
		}

		this[Protected].renderJob = newRenderJob;

		if (newRenderJob) {
			newRenderJob.addListener('change', this[RenderJobChanged]);
			newRenderJob.startMonitor();
		}

		this.emitChange({type: RENDER_JOB_CHANGE});
	}


	setEditorRef (ref) {
		this[Protected].editorRef = ref;
	}


	removeEditorRef () {
		delete this[Protected].editorRef;
	}


	get editorRef () {
		return this[Protected].editorRef;
	}


	get isSaving () {
		return this[Protected].savingCount > 0;
	}


	get errors () {
		const errors = this[Protected][ErrorMessages] || [];

		return [...errors];
	}


	get isPrePublishing () {
		return this[Protected].prepublish;
	}


	get isPublishing () {
		return this[Protected].publishing;
	}


	get hasPublished () {
		return this[Protected].hasPublished;
	}


	get isUnpublishing () {
		return this[Protected].unpublishing;
	}


	get hasDeleted () {
		return this[Protected].hasDeleted;
	}


	get isDeleting () {
		return this[Protected].deleting;
	}


	get isDeleted () {
		return this[Protected].deleted;
	}


	get renderJob () {
		return this[Protected].renderJob;
	}


	getErrorFor (id, field) {
		return this[GetMessage](ErrorMessages, id, field);
	}
}

export default new Store();
