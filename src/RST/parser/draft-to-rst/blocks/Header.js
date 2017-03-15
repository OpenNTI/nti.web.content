import {BLOCK_TYPE} from 'draft-js-utils';

// import {getUIDStringFor} from '../utils';
import {parsePlainText} from '../text-parser';

const BLOCK = Symbol('Block');
const SECTION = 'Section';
const FAKE_SECTION = 'fakesection';
const FAKE_SUB_SECTION = 'fakesubsection';
const FAKE_PARAGRAPH = 'fakeparagraph';

export const TYPE_TO_LEVEL = {
	[BLOCK_TYPE.HEADER_ONE]: 1,
	[BLOCK_TYPE.HEADER_TWO]: 2,
	[BLOCK_TYPE.HEADER_THREE]: 3,
	[BLOCK_TYPE.HEADER_FOUR]: 4,
	[BLOCK_TYPE.HEADER_FIVE]: 5,
	[BLOCK_TYPE.HEADER_SIX]: 6
};

const LEVEL_TO_CHAR = {
	1: '=',
	2: '*',
	3: '-',
	4: '.',
	5: '#',
	6: '"'
};

const LEVEL_TO_INDENT = {
	1: ' ',
	2: '',
	3: '',
	4: '',
	5: '',
	6: ''
};

const LEVEL_TO_OUTPUT_TYPE = {
	1: SECTION,
	2: SECTION,
	3: FAKE_SUB_SECTION,
	4: FAKE_PARAGRAPH,
	5: FAKE_PARAGRAPH,
	6: FAKE_PARAGRAPH
};


const OUTPUT_TYPE_TO_OUTPUT = {
	[SECTION]: (header) => {
		const {depth, isTitle} = header;
		const text = parsePlainText(header[BLOCK]);
		const lineLength = isTitle ? text.length + 2 : text.length;
		const indent = LEVEL_TO_INDENT[depth];
		const char = LEVEL_TO_CHAR[depth];

		let output = [];

		if (isTitle) {
			output.push(buildStringForChar(char, lineLength));
		}

		output.push(`${indent}${text}`);
		output.push(buildStringForChar(char, lineLength));

		return {output};
	},


	[FAKE_SECTION]: (header) => {
		const text = parsePlainText(header[BLOCK]);
		const output = [`.. ${FAKE_SECTION}:: ${text}`];

		return text.length ? {output} : {};
	},


	[FAKE_SUB_SECTION]: (header) => {
		const text = parsePlainText(header[BLOCK]);
		const output = [`.. ${FAKE_SUB_SECTION}:: ${text}`];

		return text.length ? {output} : {};
	},


	[FAKE_PARAGRAPH]: (header) => {
		const text = parsePlainText(header[BLOCK]);
		const output = [`.. ${FAKE_PARAGRAPH}:: ${text}`];

		return text.length ? {output} : {};
	}
};

function buildStringForChar (char, length) {
	return Array(length + 1).join(char);
}

export default class Header {
	static isNextBlock (inputInterface) {
		const input = inputInterface.get(0);

		return !!TYPE_TO_LEVEL[input.type];
	}

	static parse (inputInterface) {
		const input = inputInterface.get(0);

		return {block: new this(input)};
	}

	followWithBlankLine = true

	constructor (block) {
		this[BLOCK] = block;
	}

	get depth () {
		return TYPE_TO_LEVEL[this[BLOCK].type];
	}

	get isTitle () {
		return this.depth === 1;
	}

	getOutput (context) {
		const outputType = LEVEL_TO_OUTPUT_TYPE[this.depth];
		const outputFn = OUTPUT_TYPE_TO_OUTPUT[outputType];

		if (!outputFn) {
			throw new Error('Unknown output type for header');
		}

		return outputFn(this, context);
	}
}
