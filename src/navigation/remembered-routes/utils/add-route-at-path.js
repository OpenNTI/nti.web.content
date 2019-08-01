import getKeyFromPath from './get-key-from-path';

export default function addRouteAtPath (routes, path, route) {
	return {
		...routes,
		[getKeyFromPath(path)]: route
	};
}