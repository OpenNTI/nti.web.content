import {dispatch} from 'nti-lib-dispatcher';
import {SAVING, SAVE_ENDED, SET_ERROR} from './Constants';

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
	debugger;
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
