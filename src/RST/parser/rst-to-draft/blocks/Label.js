import Directive, {buildDirectiveRegex} from './Directive';

const LABEL = buildDirectiveRegex('label');

function applyLabelToPrevHeader (label, parsedInterface) {
	let prevIndex = 0;
	let prev = parsedInterface.get(prevIndex);

	while (prev && !prev.isHeader) {
		prevIndex -= 1;
		prev = parsedInterface.get(prevIndex);
	}

	if (prev) {
		prev.setBlockData('label', label);
	}
}

export default class FakeSubSection extends Directive {
	static isNextBlock (inputInterface) {
		const current = inputInterface.get(0);

		return LABEL.test(current);
	}

	static parse (inputInterface, context, parsedInterface) {
		const current = inputInterface.get(0);
		const matches = current.match(LABEL);
		const label = matches[2];

		applyLabelToPrevHeader(label, parsedInterface);

		return {block: null, context};
	}
}
