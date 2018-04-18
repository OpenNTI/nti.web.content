import {dispatch} from '@nti/lib-dispatcher';
import {wait} from '@nti/lib-commons';

import Store from './Store';
import {
	SAVING,
	SAVE_ENDED,
	DELETING,
	DELETE_ENDED,
	DELETED,
	SET_ERROR,
	CLEAR_ALL_ERRORS,
	PRE_PUBLISH,
	PUBLISHING,
	PUBLISH_ENDED,
	UNPUBLISHING,
	UNPUBLISH_ENDED,
	RESET_STORE,
	NEW_RENDER_JOB
} from './Constants';


export function resetStore () {
	dispatch(RESET_STORE);
}

export function publishContentPackage (contentPackage) {
	const {rst, version} = Store.editorRef.getRSTAndVersion();

	dispatch(PRE_PUBLISH);

	return saveContentPackageRST(contentPackage, rst, version)
		.then(() => {
			dispatch(PUBLISHING);

			return contentPackage.publish()
				.then(() => {
					const {LatestRenderJob} = contentPackage;

					dispatch(NEW_RENDER_JOB, LatestRenderJob);
					dispatch(CLEAR_ALL_ERRORS);
					dispatch(PUBLISH_ENDED);
				})
				.catch((reason) => {
					dispatch(PUBLISH_ENDED);

					dispatch(SET_ERROR, {
						NTIID: contentPackage.NTIID,
						field: 'publish',
						reason
					});
				});
		}, () => {
			dispatch(PUBLISH_ENDED);
		});
}


export function unpublishContentPackage (contentPackage) {
	dispatch(UNPUBLISHING);

	contentPackage.unpublish()
		.then(() => {
			dispatch(UNPUBLISH_ENDED);
			dispatch(CLEAR_ALL_ERRORS);
		})
		.catch((reason) => {
			dispatch(UNPUBLISH_ENDED);

			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'publish',
				reason
			});
		});
}

export function deleteContentPackage (contentPackage) {
	dispatch(DELETING);

	contentPackage.delete()
		.then(wait.min(wait.SHORT))
		.then(() => {
			dispatch(DELETED);
		})
		.catch((reason) => {
			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'deleted',
				reason
			});

			dispatch(DELETE_ENDED);
		});
}


export function saveContentPackageRST (contentPackage, rst, prevVersion) {
	dispatch(SAVING, contentPackage);

	return contentPackage.setRSTContents(rst, prevVersion)
		.then(() => {
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'contents',
				reason
			});
			dispatch(SAVE_ENDED);

			return Promise.reject(reason);
		});
}


export function saveContentPackageTitle (contentPackage, title) {
	const {title:oldTitle} = contentPackage;

	if (oldTitle === title) {
		return Promise.resolve();
	}

	dispatch(SAVING, contentPackage);

	contentPackage.save({title})
		.then(() => {
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'title',
				reason
			});
			dispatch(SAVE_ENDED);
		});
}


export function saveContentPackageDescription (contentPackage, description) {
	const {description:oldDescription} = contentPackage;

	if (oldDescription === description) {
		return Promise.resolve();
	}

	dispatch(SAVING, contentPackage);

	contentPackage.save({description})
		.then(() => {
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'description',
				reason
			});

			dispatch(SAVE_ENDED);
		});
}


export function saveContentPackageIcon (contentPackage, icon) {
	const {icon:oldIcon} = contentPackage;

	if (oldIcon === icon) {
		return Promise.resolve();
	}

	dispatch(SAVING, contentPackage);

	contentPackage.save({icon})
		.then(() => {
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'icon',
				reason
			});

			dispatch(SAVE_ENDED);
		});
}
