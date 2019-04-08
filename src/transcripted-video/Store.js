import {WebVTT, VTTCue} from 'vtt.js';
import {Stores} from '@nti/lib-store';
import Logger from '@nti/util-logger';

const logger = Logger.get('transcripted-video:store');

const UserDataSources = Symbol('UserDataSources');

function parseTranscript (vtt) {
	const parser = new WebVTT.Parser(global, WebVTT.StringDecoder());
	const cues = [];
	const regions = [];

	parser.oncue = x => cues.push(x);
	parser.onregion = x => regions.push(x);
	parser.onparsingerror = e => {throw e;};

	//Safari has a native VTTCue but it doesn't honor auto (which is in the spec)
	//so for now just force it to use the poly-fill
	const oldVTTCue = global.VTTCue;

	try {
		global.VTTCue = VTTCue;

		parser.parse(vtt);
		parser.flush();
	} finally {
		global.VTTCue = oldVTTCue;
	}

	return {cues, regions};
}


export default class VideoStore extends Stores.BoundStore {

	loadTranscript = async video => {
		const locale = this.get('locale') || 'en';
		return video.getTranscript(locale)
			.then(parseTranscript)
			.catch(() => null);
	}

	loadNotes = async (...sources) => {
		return Promise.all(
			sources.map(source => (
				(!source || !source.getUserData)
					? null
					: source.getUserData().then(data => data.waitForPending().then(() => data))
			))
		);
	}

	onNoteAdded = (note) => {
		const container = note.getContainerID ? note.getContainerID() : null;
		const dataSource = this[UserDataSources] && this[UserDataSources][container];

		if (dataSource) {
			dataSource.maybeInsertItem(note);
		}
	}


	onNoteDeleted = (note) => {
		debugger;
		const container = note.getContainerID ? note.getContainerID() : null;
		const dataSource = this[UserDataSources] && this[UserDataSources][container];

		if (dataSource) {
			dataSource.maybeRemoveItem(note);
		}
	}


	getSlideDeck = (video, mediaIndex) => {
		const {slidedecks} = video || {};

		if (!(slidedecks || []).length) {
			return;
		}

		const decks = slidedecks.filter(x => mediaIndex.get(x));

		if (!decks.length) {
			logger.warn('Referenced slidedecks do not exist in scope. %o %o', video, mediaIndex);
			return;
		}

		if (decks.length > 1) {
			logger.warn('Multiple slidedecks for video: %o %o', video.getID(), decks.join(', '));
		}

		// last one wins
		return mediaIndex.get(decks.pop());
	}

	onNotesChange = source => this.emitChange('notes')
	setNotesFilter = notesFilter => this.set({notesFilter})
	onTimeUpdate = time => this.set('currentTime', time)

	addUserDataSource (source) {
		if (!source) {
			return;
		}

		if (!source.rootId) {
			throw new Error('Received user data source with no root id?');
		}

		this[UserDataSources] = this[UserDataSources] || {};
		this[UserDataSources][source.rootId] = source;

		if ((source || {}).addListener) {
			source.addListener('change', this.onNotesChange);
			this.unsubscribe = [
				...(this.unsubscribe || []),
				() => source.removeListener('change', this.onNotesChange)
			];
		}
	}

	get notes () {
		return Object.values(this[UserDataSources] || {}).reduce((acc, source) => {
			return [...acc, ...source];
		}, []);
	}

	async load () {
		const {
			binding: {
				course,
				videoId,
				outlineId
			} = {},
			unsubscribe
		} = this;

		(unsubscribe || []).forEach(fn => fn());
		delete this.unsubscribe;

		if (!course || !videoId) {
			return;
		}

		let loading = true, error, video, slides, transcript, videoNotes, slideNotes, duration, notesFilter;

		this.set({
			loading,
			error,
			video,
			transcript,
			videoNotes,
			slideNotes,
			notesFilter
		});

		try {
			const mediaIndex = await course.getMediaIndex();
			// .then(index => index.scoped(outlineId));

			video = mediaIndex.get(videoId);

			if (video) {
				slides = this.getSlideDeck(video, mediaIndex);

				[transcript, [videoNotes, slideNotes], duration] = await Promise.all([
					this.loadTranscript(video),
					this.loadNotes(video, slides),
					video.getDuration()
				]);
			}
			else {
				logger.warn(`video not found in media index? ${videoId}, ${outlineId}, ${mediaIndex}`);
			}

		}
		catch (e) {
			error = e;
		}

		this.addUserDataSource(videoNotes);
		this.addUserDataSource(slideNotes);

		this.set({
			loading: false,
			error,
			video,
			title: (video || {}).title,
			duration,
			transcript: {
				...transcript,
				slides: [...(slides || [])]
			},
			videoNotes,
			currentTime: 0
		});
	}
}
