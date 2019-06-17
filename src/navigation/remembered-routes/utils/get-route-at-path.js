import resolveMostRecentRoute from './resolve-most-recent-route';

export default function getRouteAtPath (routes, path) {
	if (!routes) { return null; }

	let location = routes;

	for (let part of path) {
		part = part.getID ? part.getID() : part;

		if (!location.parts[part]) { break; }

		location = location.parts[part];
	}

	return resolveMostRecentRoute(location);
}