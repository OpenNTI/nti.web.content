import IndentedBlock from './IndentedBlock';

//TODO: account for listed items http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#field-lists
const FIELDLIST = /^\s*:(.*):[^`]\s*(.*)/;

export default class FieldList extends IndentedBlock {
	static isNextBlock (inputInterface) {
		const current = inputInterface.get(0);

		return FIELDLIST.test(current);
	}

	static parse (inputInterface) {
		const current = inputInterface.get(0);
		const matches = current.match(FIELDLIST);
		const name = matches[1];
		const value = matches[2];

		return {block: new this(current, '', {name, value})};
	}


	isFieldList = true


	get name () {
		return this.parts.name;
	}


	get value () {
		return this.parts.value;
	}

	getOutput (context) {
		//TODO: fill this out
		return {context};
	}
}
