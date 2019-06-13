export default function resolveMostRecentRoute (routes) {
	if (!routes) { return null; }

	let location = routes;

	while (location) {
		if (location.route) { return location.route; }

		location = location.parts[location.mostRecentPart];
	}

	return null;
}