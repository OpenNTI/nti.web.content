import Plaintext from './Plaintext';

import {getKeyForEntityText} from '../../utils';

const MARKER_FOR = Symbol('Marker For');

const EMBEDDED = /(.*)<(.*)>$/;

function parseTargetFrom (text) {
	const matches = text.match(EMBEDDED);
	const label = matches ? matches[1] : text;
	const href = matches && matches[2];

	return {
		text: label,
		href,
		key: getKeyForEntityText(label)
	};
}


export default class Target {
	static isNextBlock (inputInterface, context) {
		const input = inputInterface.getInput(0);

		return input === '_';
	}

	static parse (inputInterface, context, currentBlock) {
		const block = new this();

		if (currentBlock && (currentBlock.isInterpreted || currentBlock.isInterpreted)) {
			currentBlock.setRoleMarker(block);
			block.setMarkerFor(currentBlock);
		}

		return {block};
	}


	isTarget = true


	setMarkerFor (block) {
		this[MARKER_FOR] = block;
	}


	getOutput (context) {
		return this[MARKER_FOR] && this[MARKER_FOR].isValidRange ? null : this.getPlaintextOutput(context);
	}


	getOutputForInterpreted (block, context) {
		const {text} = block;
		const parts = parseTargetFrom(text);

		debugger;
	}


	getPlaintextOutput (context) {
		const plainText = new Plaintext('_');

		return plainText.getOutput(context);
	}
}
