import {BLOCKS} from 'nti-web-editor';

const BLOCK = Symbol('Block');

export default class Atomic {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return input.type === BLOCKS.ATOMIC;
	}


	static parse (inputInterface) {
		const input = inputInterface.get(0);

		return {block: new this(input)};
	}


	followWithBlankLine = true


	constructor (block) {
		this[BLOCK] = block;
	}

	get data () {
		return this[BLOCK].data;
	}


	getDirectiveHeader () {
		const {data} = this;

		return `.. ${data.name}:: ${data.arguments}`;
	}


	getOptionsOutput () {
		const {data} = this;
		let {options} = data;

		//TODO: figure out why we are getting a map here
		if (options.toJS) {
			options = options.toJS();
		}

		return (Object.keys(options) || []).map((key) => {
			const value = options[key];

			return `:${key}: ${value}`;
		});
	}


	getBodyOutput () {
		const {data} = this;

		return data.body;
	}


	getOutput (context) {
		const options = this.getOptionsOutput(context);
		const body = this.getBodyOutput(context);
		let output = [];

		output.push(this.getDirectiveHeader(context));

		for (let option of options) {
			output.push(`  ${option}`);
		}


		for (let part of body) {
			output.push('');//add an empty line between body parts
			output.push(`  ${part}`);
		}

		return {output};
	}
}
