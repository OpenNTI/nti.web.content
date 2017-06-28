/* eslint-env jest */
import toDraft from '../ToDraft';

function createBlock (text, styles = [], range = [], map = {}) {
	return {
		getOutput: (context) => {
			const {charCount, inlineStyleRanges, entityRanges, entityMap} = context;
			const newContext = {
				charCount: charCount + text.length,
				inlineStyleRanges: inlineStyleRanges.concat(styles),
				entityRanges: entityRanges.concat(range),
				entityMap: {...entityMap, ...map}
			};

			return {output: text, context: newContext};
		}
	};
}

const FAKE_BLOCKS = [
	createBlock('block 1 '),
	createBlock('block 2 ', [{style: 'style1'}]),
	createBlock('block 3 ', [], [{entity: 'entity1'}]),
	createBlock('block 4', [], [], {entityMap: 'entityMap'})
];

describe('text-parser toDraft', () => {
	test('Output is what is expected', () => {
		const {text, inlineStyleRanges, entityRanges, entityMap} = toDraft({blocks:FAKE_BLOCKS, context: {}});

		expect(text).toEqual('block 1 block 2 block 3 block 4');

		expect(inlineStyleRanges.length).toEqual(1);
		expect(inlineStyleRanges[0].style).toEqual('style1');

		expect(entityRanges.length).toEqual(1);
		expect(entityRanges[0].entity).toEqual('entity1');

		expect(entityMap.entityMap).toEqual('entityMap');
	});
});
