import {Stores} from '@nti/lib-store';
import {
	loadPageDescriptor
} from '@nti/lib-content-processing';

export default class ContentViewerStore extends Stores.BoundStore {
	async load () {
		this.set({
			loading: true,
			error: null,
			pageDescriptor: null
		});

		try {
			const {bundle, pageId} = this.binding;
			const pageDescriptor = await loadPageDescriptor(pageId, bundle);

			this.set({
				loading: false,
				pageDescriptor
			});
		} catch (e) {
			this.set({
				error: e,
				loading: false
			});
		}
	}


	setContentBody (contentBody) {
		setImmediate(() => {
			this.set({
				contentBody,
				prestineContentBody: contentBody && contentBody.cloneNode(true)
			});
		});
	}
}
