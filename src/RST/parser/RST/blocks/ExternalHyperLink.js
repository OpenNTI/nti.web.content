import {ENTITY_TYPE} from 'draft-js-utils';

const EXTERNAL_TARGET = /^.. _([^:|^_]+):\s?(.*)/;

export default {
	isTypeForBlock (block) {
		return EXTERNAL_TARGET.test(block);
	},


	parse (block, context) {
		const matches = block.match(EXTERNAL_TARGET);
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
