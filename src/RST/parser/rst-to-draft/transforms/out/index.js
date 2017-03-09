import toDraft from './toDraft';
import removeTitle from './removeTitle';
//TODO: look into if we need to write a out transformation to remove entity ranges
//that don't have an entity in the map

export default [
	toDraft,
	removeTitle
];
