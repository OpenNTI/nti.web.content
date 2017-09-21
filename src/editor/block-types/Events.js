import { EventEmitter } from 'events';

const MODIFICATION_BUS = new EventEmitter();

export const VIDEO_DELETED_EVENT = 'video-deleted';

export function addListener (event, handlerFn) {
	MODIFICATION_BUS.addListener(event, handlerFn);
}

export function removeListener (event, handlerFn) {
	MODIFICATION_BUS.removeListener(event, handlerFn);
}

export function emitEvent (event, data) {
	MODIFICATION_BUS.emit(event, data);
}
