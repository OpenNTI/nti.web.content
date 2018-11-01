import './Highlight';
import './Note';
import Registry from './Registry';

const registry = Registry.getInstance();

export function getType (item) {
	return registry.getItemFor(item);
}
