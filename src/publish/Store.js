import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

export default class BookPublishStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true,
			error: null,
		});
	}

	async load () {
		if (!this.binding) { return; }

		const content = this.binding;

		if (typeof content !== 'string') { return this.setupContent(content); }

		this.set({
			loading: true,
			error: null
		});


		try {
			const service = await getService();
			const contentInstance = await service.getObject(content);

			this.setupContent(contentInstance);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}


	setupContent (content) {
		this.set({
			loading: false,
			error: null,
			contentInstance: content,
			published: content.isPublished && content.isPublished(),
			canPublish: content.canPublish && content.canPublish(),
			canUnpublish: content.canUnpublish && content.canUnpublish()
		});
	}


	async setPublishState (published) {
		const content = this.get('contentInstance');

		this.set({
			loading: true,
			published
		});

		try {
			await content.setPublishState(published);

			this.setupContent(content);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}

	}


	publish () {
		this.setPublishState(true);
	}


	unpublish () {
		this.setPublishState(false);
	}
}
