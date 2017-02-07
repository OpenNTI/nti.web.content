import {ENTITY_TYPE} from 'draft-js-utils';

import IndentedBlock from './IndentedBlock';

import {normalizeEntityName} from '../utils';

const EXTERNAL_TARGET = /^.. _([^:|^_]+):\s?(.*)/;

export default class ExternalHyperLink extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const current = inputInterface.get();

		return EXTERNAL_TARGET.test(current);
	}

	static parse (inputInterface) {
		const current = inputInterface.get();

		const matches = current.match(EXTERNAL_TARGET);
		const name = matches[1];
		const target = matches[2];

		return {block: new this(current, '..', {name, target})};
	}


	get name () {
		return this.parts.name;
	}


	get target () {
		return this.parts.target;
	}

	get mutability () {
		//TODO: look into when this would need to be immutable or segmented
		return 'MUTABLE';
	}


	shouldAppendBlock (/*block*/) {
		//TODO: there is a format where the target may be on the next line so check for that case
	}


	getOutput (context) {
		const {name, target} = this;

		if (!context.entityMap) {
			context.entityMap = {};
		}

		context.entityMap[normalizeEntityName(name)] = {
			type: ENTITY_TYPE.LINK,
			mutability: 'MUTABLE',
			data: {
				name: name,
				href: target
			}
		};

		return {context};
	}
}
