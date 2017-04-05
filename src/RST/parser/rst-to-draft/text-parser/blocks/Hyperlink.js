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

	parseTargetFrom.idGen += 1;

	return {
		name,
		href,
		key: href ? parseTargetFrom.idGen : normalizeEntityName(name)
	};
}


parseTargetFrom.idGen = 0;


export default class Target {
	static isNextBlock (inputInterface, context, parsedInterface) {
		const currentBlock = parsedInterface.get(0);
		const input = inputInterface.get(0);
		const prevInput = inputInterface.get(-1);
		const nextInput = inputInterface.get(1);

		return input === '_' && //Check that its an underscore
					!context.openRange && //and we aren't parsing a range
					(!currentBlock || (currentBlock.isInterpreted || currentBlock.isPlaintext)) && //and if there is a one the current block is linkable
					Regex.isValidRangeEnd(prevInput, nextInput); //and that we are a valid end of a range
	}

	static parse (inputInterface, context, parsedInterface) {
		const currentBlock = parsedInterface.get(0);
		const nextInput = inputInterface.get(1);
		const block = new this();

		if (currentBlock && (currentBlock.isInterpreted || currentBlock.isPlaintext)) {
			currentBlock.setRoleMarker(block);
			block.setMarkerFor(currentBlock);
		}

		return {block, length: nextInput === '_' ? 2 : 1};
	}


	isTarget = true

	get mutability () {
		//TODO look at when this would need to be false
		return 'MUTABLE';
	}


	get markerFor () {
		return this[MARKER_FOR];
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
