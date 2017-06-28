/* eslint-env jest */
import toDraft from '../toDraft';

function createBlock (block, map = {}) {
	return {
		toDraft: (context) => {
			const {entityMap} = context;
			const newContext = {
				entityMap: {...entityMap, ...map}
			};

			return {output: block, context: newContext};
		}
	};
}

const FAKE_BLOCKS = [
	createBlock('block 1'),
	createBlock('block 2', {'entity1': 'entity1'}),
	createBlock(null, {'entity2': 'entity2'})
];

describe('rst-to-draft toDraft', () => {
	test('Output is whats expected', () => {
		const {blocks, entityMap} = toDraft({blocks:FAKE_BLOCKS, context:{}});

		expect(blocks.length).toEqual(2);
		expect(blocks[0]).toEqual('block 1');
		expect(blocks[1]).toEqual('block 2');
		expect(Object.keys(entityMap).length).toEqual(2);
		expect(entityMap['entity1']).toEqual('entity1');
		expect(entityMap['entity2']).toEqual('entity2');
	});
});
