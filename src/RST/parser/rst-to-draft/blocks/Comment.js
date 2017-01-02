import IndentedBlock from './IndentedBlock';

const COMMENT = /^\.\.(.*)/;

export default class Comment extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const current = inputInterface.getInput(0);

		return COMMENT.test(current);
	}

	static parse (inputInterface) {
		const input = inputInterface.getInput(0);
		const matches = input.match(COMMENT);
		const text = matches[1];

		return {block: new this(input, '..', {text:[text]})};
	}


	shouldAppendBlock (block) {
		debugger;
		//Any non-empty blocks that are indented get appended to the comment
		return !block.isEmpty && (block.depth > this.depth || block.offset > this.offset);
	}


	appendBlock (block) {
		if (block.text) {
			this.parts.text.push(block.text);
		}

		return {block: this};
	}

	//For now comments aren't going to output anything
	getOutput () {
		return {};
	}
}
