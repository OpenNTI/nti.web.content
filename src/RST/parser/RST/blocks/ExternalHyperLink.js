import {ENTITY_TYPE} from 'draft-js-utils';

const EXTERNAL_TARGET = /^.. _([^:|^_]+):\s?(.*)/;

export default {
	isNextBlock (inputInterface) {
		const input = inputInterface.getInput();

		return EXTERNAL_TARGET.test(input);
	},


	parse (inputInterface, context) {
		const input = inputInterface.getInput();

		const matches = input.match(EXTERNAL_TARGET);
		const name = matches[1];
		const target = matches[2];

		if (!context.entityMap) {
			context.entityMap = {};
		}

		context.entityMap[name] = {
			type: ENTITY_TYPE.LINK,
			mutability: 'MUTABLE',
			data: {
				name: name,
				url: target
			}
		};

		return {context};
	}
};
