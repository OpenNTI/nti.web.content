import isSameRoute from './is-same-route';

export default function isRouteActive(route, active) {
	return isSameRoute(route, active) || active.indexOf(route) === 0;
}
