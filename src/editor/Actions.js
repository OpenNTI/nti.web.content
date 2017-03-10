import {dispatch} from 'nti-lib-dispatcher';
import {Prompt} from 'nti-web-commons';
import {wait} from 'nti-commons';

import {
	SAVING,
	SAVE_ENDED,
	DELETING,
	DELETE_ENDED,
	DELETED,
	SET_ERROR,
	CLEAR_ALL_ERRORS,
	PUBLISHING,
	PUBLISH_ENDED,
	UNPUBLISHING,
	UNPUBLISH_ENDED,
	RESET_STORE
} from './Constants';


export function resetStore () {
	dispatch(RESET_STORE);
}


export function publishContentPackage (contentPackage) {
	dispatch(PUBLISHING);

	contentPackage.publish()
		.then(() => {
			dispatch(PUBLISH_ENDED);
			dispatch(CLEAR_ALL_ERRORS);
		})
		.catch((reason) => {
			dispatch(PUBLISH_ENDED);

			dispatch(SET_ERROR, {
				NTIID: contentPackage.NTIID,
				field: 'publish',
				reason
			});
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

export function deleteContentPackage (contentPackage, message) {
	Prompt.areYouSure(message)
		.then(() => {
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
		});
}


export function saveContentPackageRST (contentPackage, rst) {
	dispatch(SAVING, contentPackage);

	contentPackage.setRSTContents(rst)
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
