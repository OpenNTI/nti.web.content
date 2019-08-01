export default function getKeyFromPath (path) {
	return path
		.map(part => part.getID ? part.getID() : part)
		.join('/');
}