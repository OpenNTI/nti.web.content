import {BLOCK_TYPE} from 'draft-js-utils';

import Directive, {buildDirectiveRegex} from './Directive';
import Text from './Text';

const FAKE_SECTION = buildDirectiveRegex('fakesection');

export default class FakeSection extends Directive {
	static isNextBlock (inputInterface) {
		const current = inputInterface.get(0);

		return FAKE_SECTION.test(current);
	}


	getOutput (context) {
		const text = new Text(this.arguments);
		const {output, context:newContext} = text.getOutput(context);

		return {output: {...output, type: BLOCK_TYPE.HEADER_TWO, depth: 0, data: this.blockData}, context: newContext};
	}
}
