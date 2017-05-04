import {BLOCKS} from '../../../../draft-core';

import IndentedBlock from './IndentedBlock';

const OPTIONS = Symbol('Options');
const BODY = Symbol('Body');

export function buildDirectiveRegex (name) {
	return new RegExp(`^..\\s(${name})::\\s(.*)$`);
}

const GENERIC_DIRECTIVE = buildDirectiveRegex('.*');


export default class Directive extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const current = inputInterface.get(0);

		return GENERIC_DIRECTIVE.test(current);
	}


	static parse (inputInterface) {
		const current = inputInterface.get(0);
		const matches = current.match(GENERIC_DIRECTIVE);
		const name = matches[1];
		const args = matches[2];

		return {block: new this(current, '..', {name, args})};
	}


	constructor (...args) {
		super(...args);

		this[OPTIONS] = {};
		this[BODY] = [];
	}


	get arguments () {
		return this.parts.args;
	}


	get name () {
		return this.parts.name;
	}


	get options () {
		return this[OPTIONS];
	}


	get body () {
		return this[BODY];
	}


	shouldAppendBlock (block) {
		return block.depth > this.depth || block.isEmpty;
	}


	appendBlock (block, context) {
		if (block.isFieldList) {
			this.addField(block);
		} else if (!block.isEmpty) {
			this.addToBody(block);
		}

		return {block: this, context};
	}


	addField (block) {
		this[OPTIONS][block.name] = block.value;
	}


	addToBody (block) {
		this[BODY].push(block);
	}


	getOutput () {
		const body = this.body.map((x) => x.raw);

		const output = {
			type: BLOCKS.ATOMIC,
			depth: 0,
			data: {name: this.name, options: {...this.options}, arguments: this.arguments, body},
			inlineStyleRanges: [],
			entityRanges: [],
			text: ''
		};

		return {output};
	}
}
