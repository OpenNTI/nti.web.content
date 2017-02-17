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
