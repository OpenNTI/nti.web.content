function createPart () {
	return {
		mostRecentPart: '',
		parts: {}
	};
}

export default function addRouteAtPath (routes, path, route) {
	routes = routes || createPart();

	let location = routes;

	for (let part of path) {
		if (!location.parts[part]) { location.parts[part] = createPart(); }

		location.mostRecentPart = part;
		location = location.parts[part];
	}

	location.route = route;

	return routes;
}