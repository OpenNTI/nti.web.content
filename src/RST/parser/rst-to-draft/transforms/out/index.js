import toDraft from './toDraft';
import ensureFocusable from './ensureFocusable';
//TODO: look into if we need to write a out transformation to remove entity ranges
//that don't have an entity in the map

export default [
	toDraft,
	ensureFocusable
];
