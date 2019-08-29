export default function isSameRoute (a, b) {
	const trim = route => route.replace(/\/$/, '');

	return trim(a) === trim(b);
}
