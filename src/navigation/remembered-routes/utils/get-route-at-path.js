import getKeyFromPath from './get-key-from-path';

export default function getRouteAtPath(routes = {}, path) {
	return routes[getKeyFromPath(path)];
}
