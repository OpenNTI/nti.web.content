import {
	convertFromRaw
} from 'draft-js';

import {BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE} from 'draft-js-utils';

// export const TestRST = '=============\nTest RST File\n=============\n\nInline Styles\n-------------\n\nEmphasis\n++++++++\n\nThis paragraph that will have **bold** and *italics* in it. We need to try nesting them like ** bold and *italic***, ***bold/italic***, and *italic and **bold*** (this format does not work).\n\nSince the above format doesn\'t work and there is no support for underline, which while not necessarily that useful is expected by most users. We can use roles to also style text. Some roles like :emphasis:`emphasis`, :strong:`strong`, and :math:`math`; are built in. You can also define some custom roles, which we might need to do for all permutations of bold, italic, and underlined. For example :bolditalic:`bolditalic`, :boldunderlined:`boldunderline`, :italicunderlined:`italicunderlined`, :bolditalicunderlined:`bolditalicunderlined`.\n\n++++++++++\nReferences\n++++++++++\n\nThis paragraph will have different styles of links that RST supports. Such as `External Hyperlink Targets`_. Also the embedded URI format, details found `here <http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#embedded-uris>`_.\n\nWe will also need to test internal hyperlink targets. Like linking to the `Inline Styles`_ section. I wonder if the embedded URI format will for for this `Test Link <Emphasis>`_ (It Treats it as a URI so I guess it doesn\'t).\n\n.. _External Hyperlink Targets: http://docutils.sourceforge.net/docs/user/rst/quickref.html#hyperlink-targets\n\n------------------\nImages and Figures\n------------------\n\nImages can be treated as a block by just using its directive:\n\n.. image:: images/block.png\n\nOr if you want them to show up in line like |inlineimage|, you can use a Substitution Reference and Definition.\n\n.. |inlineimage| image:: images/sub.png\n\n.. figure:: images/figure.png\n	:alt: figure alt text\n	:align: left\n\n	Figure caption\n\n	This is the figure legend\n\n-----\nLists\n-----\n\n+++++++++++++\nBulleted List\n+++++++++++++\n\n- Bullet List Item 1\n\n	- Nested Bullet List Item 1-1\n	- Nested Bullet List Item 1-2\n\n		- Double Nested Bullet List Item 1-2-1\n		- Double Nested Bullet List Item 1-2-2\n\n	- Nested Bullet List Item 1-3\n	- Nested Bullet List Item 1-4\n\n- Bullet List Item 2\n\n	- Nested Bullet List Item 2-1\n	- Nested Bullet List Item 2-2\n	- Nested Bullet List Item 2-3\n\n- Bullet List Item 3\n- Bullet List Item 4\n\n+++++++++++++++\nEnumerated List\n+++++++++++++++\n\n1. Ordered List Item 1\n\n	(a) Nested Ordered List Item 1-1\n	(b) Nested Ordered List Item 1-2\n\n		i) Double Nested Ordered List Item 1-2-1\n		ii) Double Nested Ordered List Item 1-2-2\n\n	(c) Nested Ordered List Item 1-3\n	(d) Nested Ordered List Item 1-4\n\n2. Ordered List Item 2\n\n	(a) Nested Ordered List Item 1-1\n	(b) Nested Ordered List Item 1-2\n	(c) Nested Ordered List Item 1-3\n\n3. Ordered List Item 3\n4. Ordered List Item 4\n\n\n----------\nDirectives\n----------\n\n.. testdirective::\n	test directive\n';
export const TestRST = '.. docid:: random-doc-id\nthis paragraph has that random doc id';
function createBlankBlock (type, depth) {
	return {
		depth: depth,
		entityRanges: [],
		inlineStyleRanges: [],
		text: '',
		type: type
	};
}

const STATES = {
	HEADER_OPEN: 'header open',
	NONE: 'no state'
};

const lineTypes = [
	{
		isHeader: true,
		regex: /^([\=,\-,\+])\1+$/
	}
];

function createBlock (type, depth, text, entityMap) {
	const block = {
		depth,
		entityRanges: [],
		inlineStyleRanges: [],
		text: '',
		type
	};

	let remaining = text;
	let activeStyle;
	let escaped = false;
	let lastChar;


	while (remaining.length) {
		let char = remaining.charAt(0);

		if (char === '\\' && !escaped) {
			escaped = true;
			lastChar = null;
		} else if (char === '*' && !escaped) {
			//If we haven't started a style yet start an italic range
			if (!activeStyle) {
				activeStyle = {
					style: INLINE_STYLE.ITALIC,
					offset: block.text.length
				};
			//If we just had * change the active range to bold
			} else if (lastChar === '*') {
				activeStyle.style = INLINE_STYLE.BOLD;
			//If we hit a * and are have an active italic range close it
			} else if (lastChar !== '*' && activeStyle.style === INLINE_STYLE.ITALIC) {
				activeStyle.range = block.text.length - activeStyle.offset;
			//If we hit a * and and just a * and have an active bold range close it
			} else if (lastChar === '*' && activeStyle.style === INLINE_STYLE.BOLD) {
				activeStyle.range = block.text.length - activeStyle.offset;
			}

			lastChar = '*';
		} else {
			block.text += char;

			lastChar = char;
		}

		block.text += char;
		remaining = remaining.substr(1);
	}

	return block;
}

class RSTParser {
	constructor (rst) {
		this.rst = rst;

		this.currentBlock = null;

		this.headerCharacters = [];

		this.blocks = [];
		this.entityMap = {};
	}


	parse () {
		const lines = this.rst.split('\n');

		for (let line of lines) {
			this.parseLine(line);
		}
	}


	parseLine (line) {
		let parsed = false;

		if (!line) {
			this.currentBlock = null;
		}

		for (let lineType of lineTypes) {
			if (!lineType.regex.test(line)) {
				continue;
			} else if (lineType.isHeader) {
				parsed = true;
				this.parseHeader(line);
			}
		}


		if (!parsed) {
			this.parseText(line);
		}
	}


	parseHeader (line) {
		const char = line[0];

		if (this.currentBlock) {
			//Turn the current block into a header
			debugger;
		}
	}


	parseText (line) {
		this.blocks.push(createBlock(BLOCK_TYPE.UNSTYLED, 0, line, this.entityMap));
	}
}

export default function parseRST (rst) {
	const parser = new RSTParser(rst);

	return convertFromRaw(parser.parse());
}
