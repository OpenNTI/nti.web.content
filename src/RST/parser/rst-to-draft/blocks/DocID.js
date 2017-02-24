import Directive, {buildDirectiveRegex} from './Directive';

const DOCID = buildDirectiveRegex('docid');

export default class DocID extends Directive {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return DOCID.test(input);
	}


	shouldAppendBlock () {
		return true;
	}


	appendBlock (block) {
		block.setBlockData('DocID', this.parts.args);

		return {block};
	}
}
