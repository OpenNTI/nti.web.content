import './MarkupFrame';
import './Video';
import Default from './Default';
import Registry from './Registry';

const registry = Registry.getInstance();

export function getCmpFor (part) {
	const cmp = registry.getItemFor(part);

	return cmp || Default;
}
