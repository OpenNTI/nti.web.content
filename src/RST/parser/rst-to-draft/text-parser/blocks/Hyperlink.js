import {ENTITY_TYPE} from 'draft-js-utils';

import {normalizeEntityName} from '../../utils';
import Regex from '../Regex';

import Plaintext from './Plaintext';

const MARKER_FOR = Symbol('Marker For');

const EMBEDDED = /(.*)\s<(.*)>$/;

function parseTargetFrom (text) {
	const matches = text.match(EMBEDDED);
	const name = matches ? matches[1] : text;
	const href = matches && matches[2];

	return {
		name,
		href,
		key: normalizeEntityName(name)
	};
}


export default class Target {
	static isNextBlock (inputInterface, context, currentBlock) {
		const input = inputInterface.getInput(0);
		const prevInput = inputInterface.getInput(-1);
		const nextInput = inputInterface.getInput(1);

		return input === '_' && //Check that its an underscore
					!context.openRange && //and we aren't parsing a range
					(currentBlock.isInterpreted || currentBlock.isPlaintext) && //and that the current block is linkable
					Regex.isValidRangeEnd(prevInput, nextInput); //and that we are a valid end of a range
	}

	static parse (inputInterface, context, currentBlock) {
		const block = new this();

		if (currentBlock && (currentBlock.isInterpreted || currentBlock.isPlaintext)) {
			currentBlock.setRoleMarker(block);
			block.setMarkerFor(currentBlock);
		}

		return {block};
	}


	isTarget = true

	get mutability () {
		//TODO look at when this would need to be false
		return 'MUTABLE';
	}


	setMarkerFor (block) {
		this[MARKER_FOR] = block;
	}


	getOutput (context) {
		return this[MARKER_FOR] && (this[MARKER_FOR].isValidRange || this[MARKER_FOR].isPlaintext) ? null : this.getPlaintextOutput(context);
	}


	getOutputForInterpreted (block, context) {
		const {text} = block;
		const {name, key, href} = parseTargetFrom(text);
		const range = key && {key, offset: context.charCount, length: name.length};
		const entity = key && href && {type: ENTITY_TYPE.LINK, mutability: this.mutability, data: {name, href}};

		const plainText = new Plaintext(name);
		const {output, context:newContext} = plainText.getOutput(context);

		if (range) {
			newContext.entityRanges = [...(newContext.entityRanges || []), range];
		}

		if (entity) {
			newContext.entityMap = {...(newContext.entityMap || {}), [key]: entity};
		}

		return {output, context: newContext};
	}


	getPlaintextOutput (context) {
		const plainText = new Plaintext('_');

		return plainText.getOutput(context);
	}
}
