import Directive, {buildDirectiveRegex} from './Directive';

const DOCID = buildDirectiveRegex('uid');

export default class DocID extends Directive {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return DOCID.test(input);
	}


	shouldAppendBlock () {
		return true;
	}


	appendBlock (block) {
		let nextBlock;

		if (block.isComment || block.isEmpty) {
			nextBlock = this;
		} else {
			block.setBlockData('UID', this.parts.args);
			nextBlock = block;
		}

		return {block: nextBlock};
	}
}
