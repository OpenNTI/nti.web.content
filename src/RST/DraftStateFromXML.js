import {
	convertFromRaw
} from 'draft-js';

import {BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE} from 'draft-js-utils';


export const TestXML = '<?xml version="1.0" ?><document ids="test-rst-file" names="test\ rst\ file" source="test.rst" title="Test RST File"><title>Test RST File</title><section ids="inline-styles" names="inline\ styles"><title>Inline Styles</title><section ids="emphasis" names="emphasis"><title>Emphasis</title><paragraph>This paragraph that will have <strong>bold</strong> and <emphasis>italics</emphasis> in it. We need to try nesting them like ** bold and <emphasis>italic**</emphasis>, <strong>*bold/italic*</strong>, and <emphasis>italic and **bold**</emphasis> (this format does not work).</paragraph><paragraph>Since the above format doesn\'t work and there is no support for underline, which while not necessarily that useful is expected by most users. We can use roles to also style text. Some roles like <emphasis>emphasis</emphasis>, <strong>strong</strong>, and <math>math</math>; are built in. You can also define some custom roles, which we might need to do for all permutations of bold, italic, and underlined. For example <bolditalic>bolditalic</bolditalic>, <boldunderlined>boldunderline</boldunderlined>, <italicunderlined>italicunderlined</italicunderlined>, <bolditalicunderlined>bolditalicunderlined</bolditalicunderlined>.</paragraph></section><section ids="references" names="references"><title>References</title><paragraph>This paragraph will have different styles of links that RST supports. Such as <reference name="External Hyperlink Targets" refuri="http://docutils.sourceforge.net/docs/user/rst/quickref.html#hyperlink-targets">External Hyperlink Targets</reference>. Also the embedded URI format, details found <reference name="here" refuri="http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#embedded-uris">here</reference><target ids="here" names="here" refuri="http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#embedded-uris"/>.</paragraph><paragraph>We will also need to test internal hyperlink targets. Like linking to the <reference name="Inline Styles" refid="inline-styles">Inline Styles</reference> section. I wonder if the embedded URI format will for for this <reference name="Test Link" refuri="Emphasis">Test Link</reference><target ids="test-link" names="test\ link" refuri="Emphasis"/> (It Treats it as a URI so I guess it doesn\'t).</paragraph><target ids="external-hyperlink-targets" names="external\ hyperlink\ targets" refuri="http:\/\/docutils.sourceforge.net\/docs\/user\/rst\/quickref.html#hyperlink-targets"\/><\/section><\/section><section ids="images-and-figures" names="images\ and\ figures"><title>Images and Figures<\/title><paragraph>Images can be treated as a block by just using its directive:<\/paragraph><image uri="images/block.png"/><paragraph>Or if you want them to show up in line like <image alt="inlineimage" uri="images/sub.png"/>, you can use a Substitution Reference and Definition.</paragraph><substitution_definition names="inlineimage"><image alt="inlineimage" uri="images/sub.png"/></substitution_definition><figure align="left"><image alt="figure alt text" uri="images/figure.png"/><caption>Figure caption</caption><legend><paragraph>This is the figure legend</paragraph></legend></figure></section><section ids="lists" names="lists"><title>Lists</title><section ids="bulleted-list" names="bulleted\ list"><title>Bulleted List</title><bullet_list bullet="-"><list_item><paragraph>Bullet List Item 1</paragraph><block_quote><bullet_list bullet="-"><list_item><paragraph>Nested Bullet List Item 1-1</paragraph></list_item><list_item><paragraph>Nested Bullet List Item 1-2</paragraph><block_quote><bullet_list bullet="-"><list_item><paragraph>Double Nested Bullet List Item 1-2-1</paragraph></list_item><list_item><paragraph>Double Nested Bullet List Item 1-2-2</paragraph></list_item></bullet_list></block_quote></list_item><list_item><paragraph>Nested Bullet List Item 1-3</paragraph></list_item><list_item><paragraph>Nested Bullet List Item 1-4</paragraph></list_item></bullet_list></block_quote></list_item><list_item><paragraph>Bullet List Item 2</paragraph><block_quote><bullet_list bullet="-"><list_item><paragraph>Nested Bullet List Item 2-1</paragraph></list_item><list_item><paragraph>Nested Bullet List Item 2-2</paragraph></list_item><list_item><paragraph>Nested Bullet List Item 2-3</paragraph></list_item></bullet_list></block_quote></list_item><list_item><paragraph>Bullet List Item 3</paragraph></list_item><list_item><paragraph>Bullet List Item 4</paragraph></list_item></bullet_list></section><section ids="enumerated-list" names="enumerated\ list"><title>Enumerated List</title><enumerated_list enumtype="arabic" prefix="" suffix="."><list_item><paragraph>Ordered List Item 1</paragraph><block_quote><enumerated_list enumtype="loweralpha" prefix="(" suffix=")"><list_item><paragraph>Nested Ordered List Item 1-1</paragraph></list_item><list_item><paragraph>Nested Ordered List Item 1-2</paragraph><block_quote><enumerated_list enumtype="lowerroman" prefix="" suffix=")"><list_item><paragraph>Double Nested Ordered List Item 1-2-1</paragraph></list_item><list_item><paragraph>Double Nested Ordered List Item 1-2-2</paragraph></list_item></enumerated_list></block_quote></list_item><list_item><paragraph>Nested Ordered List Item 1-3</paragraph></list_item><list_item><paragraph>Nested Ordered List Item 1-4</paragraph></list_item></enumerated_list></block_quote></list_item><list_item><paragraph>Ordered List Item 2</paragraph><block_quote><enumerated_list enumtype="loweralpha" prefix="(" suffix=")"><list_item><paragraph>Nested Ordered List Item 1-1</paragraph></list_item><list_item><paragraph>Nested Ordered List Item 1-2</paragraph></list_item><list_item><paragraph>Nested Ordered List Item 1-3</paragraph></list_item></enumerated_list></block_quote></list_item><list_item><paragraph>Ordered List Item 3</paragraph></list_item><list_item><paragraph>Ordered List Item 4</paragraph></list_item></enumerated_list></section></section><section ids="directives" names="directives"><title>Directives</title></section></document>';

function createBlankBlock (type, depth) {
	return {
		depth: depth,
		entityRanges: [],
		inlineStyleRanges: [],
		text: '',
		type: type
	};
}


const TITLE_MAP = {
	0: BLOCK_TYPE.HEADER_ONE,
	1: BLOCK_TYPE.HEADER_TWO,
	2: BLOCK_TYPE.HEADER_THREE,
	3: BLOCK_TYPE.HEADER_FOUR,
	4: BLOCK_TYPE.HEADER_FIVE,
	5: BLOCK_TYPE.HEADER_SIX
};


const TAG_HANDLERS = {
	'document': {
		NOOP: true
	},
	'blockquote': {
		NOOP: true//Just do this for now
	},
	'title': {
		isBlock: true,
		getBlock (node, sectionDepth) {
			if (sectionDepth > 5) {
				sectionDepth = 5;
			}

			return createBlankBlock(TITLE_MAP[sectionDepth]);
		}
	},
	'paragraph': {
		isBlock: true,
		getBlock () {
			return createBlankBlock(BLOCK_TYPE.UNSTYLED);
		}
	},
	'strong': {
		isInlineStyle: true,
		type: [INLINE_STYLE.BOLD]
	},
	'emphasis': {
		isInlineStyle: true,
		type: [INLINE_STYLE.ITALIC]
	},
	'math': {
		isInlineStyle: true,
		type: [INLINE_STYLE.CODE]
	},
	'bolditalic': {
		isInlineStyle: true,
		type: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC]
	},
	'boldunderlined': {
		isInlineStyle: true,
		type: [INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE]
	},
	'italicunderlined': {
		isInlineStyle: true,
		type: [INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]
	},
	'bolditalicunderlined': {
		isInlineStyle: true,
		type: [INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE]
	},
	'reference': {
		isEntity: true,
		type: ENTITY_TYPE.LINK,
		getData (node) {
			const name = node.getAttribute('name');
			const url = node.getAttribute('refuri');

			return {name, url};
		}
	},
	'section': {
		isSection: true
	},
	undefined: {
		isText: true
	}
};

class XMLToDraftState {
	constructor (xml) {
		this.dom = new DOMParser().parseFromString(xml, 'text/xml');
		this.doc = this.dom.querySelector('document');

		this.blocks = [];
		this.entityMap = {};

		this.currentBlocks = [];

		this.sectionDepth = 0;
	}


	get currentBlock () {
		return this.currentBlocks[this.currentBlocks.length - 1];
	}


	getDepthOfNode (node) {
		let depth = 0;

		while (node && node !== this.doc) {
			depth += 1;
			node = node.parentNode;
		}

		return depth;
	}

	parse () {
		this.parseNode(this.doc);

		return {blocks: this.blocks, entityMap: this.entityMap};
	}


	parseNode (node) {
		const handler = TAG_HANDLERS[node.tagName];

		if (!handler) {
			//TODO: figure out how to do something here
		} else if (handler.NOOP) {
			this.parseNodeChildren(node);
		} else if (handler.isBlock) {
			this.parseBlockNode(handler, node);
		} else if (handler.isInlineStyle) {
			this.parseInlineStyle(handler, node);
		} else if (handler.isEntity) {
			this.parseEntity(handler, node);
		} else if (handler.isText) {
			this.parseText(handler, node);
		} else if (handler.isSection) {
			this.parseSection(handler, node);
		}
	}


	parseNodeChildren (node) {
		node.childNodes.forEach(x => this.parseNode(x));
	}

	parseSection (handler, node) {
		this.sectionDepth += 1;

		this.parseNodeChildren(node);

		this.sectionDepth -= 1;
	}


	parseBlockNode (handler, node) {
		if (this.hasOpenStyle || this.hasOpenEntity) {
			throw new Error('Parsing Block while there is an open style');
		}

		const block = handler.getBlock(node, this.sectionDepth, this.listDepth);

		this.blocks.push(block);

		this.currentBlocks.push(block);

		this.parseNodeChildren(node);

		this.currentBlocks.pop();
	}


	parseInlineStyle (handler, node) {
		const currentBlock = this.currentBlock;

		if (!currentBlock) {
			throw new Error('Inline Style element outside of a block');
		}

		const offset = currentBlock.text.length;
		const styles = handler.type.map((type) => {
			return {
				style: type,
				offset: offset
			};
		});


		this.hasOpenStyle = true;

		currentBlock.inlineStyleRanges = [...currentBlock.inlineStyleRanges, ...styles];

		this.parseNodeChildren(node);

		const length = currentBlock.text.length;

		for (let style of styles) {
			style.length = length - style.offset;
		}

		this.hasOpenStyle = false;
	}


	parseEntity (handler, node) {
		const currentBlock = this.currentBlock;

		if (!currentBlock) {
			throw new Error('Entity element outside of a block');
		}

		const key = currentBlock.entityRanges.length;
		const mutable = handler.isMutable ? handler.isMutable(node) : true;
		const entity = {
			type: handler.type,
			mutability: mutable ? 'MUTABLE' : 'IMMUTABLE',
			data: handler.getData(node)
		};
		const range =  {
			key,
			offset: currentBlock.text.length
		};

		this.hasOpenEntity = true;

		this.entityMap[key] = entity;
		currentBlock.entityRanges.push(range);

		this.parseNodeChildren(node);

		range.length = currentBlock.text.length - range.offset;
		this.hasOpenEntity = false;
	}


	parseText (handler, node) {
		const currentBlock = this.currentBlock;

		if (!currentBlock) {
			throw new Error('Text Node element outside of a block');
		}

		currentBlock.text = currentBlock.text + node.textContent;
	}
}

export default function parseXML (xml) {
	const parser = new XMLToDraftState(xml);

	return convertFromRaw(parser.parse());
}
