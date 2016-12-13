import Block from './Block';

import {getIndention} from '../utils';

const INDENTION = Symbol('Indention');

export default class IndentedBlock extends Block {
	constructor (block, blockIndicator, parts) {
		super(block, parts);

		this[INDENTION] = getIndention(block, blockIndicator);
	}


	get indention () {
		return this[INDENTION];
	}


	get depth () {
		const {indention} = this;

		return indention.blockOffset;
	}


	get offset () {
		const {indention} = this;

		return indention.lineOffset;
	}


	isSameDepth (block) {
		const {depth:myDepth} = this;
		const {depth:theirDepth} = block;

		return myDepth === theirDepth;
	}


	isSameOffset (block) {
		const {offset:myOffset} = this;
		const {offset:theirOffset} = block;

		return myOffset === theirOffset;
	}
}
