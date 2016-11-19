import {
	convertFromRaw
} from 'draft-js';

import {BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE} from 'draft-js-utils';


export const TestXML = '<?xml version="1.0" ?><document source="test.rst"><paragraph><strong>italic</strong> <emphasis>bold</emphasis> <reference name="Test" refuri="http://www.google.com">Test</reference>. footnote test <footnote_reference ids="id1" refid="id2">5</footnote_reference>. Link to <reference name="Title Target" refid="title-target">Title Target</reference>.</paragraph><target ids="test" names="test" refuri="http://www.google.com"/><footnote backrefs="id1" ids="id2" names="5"><label>5</label><paragraph>A numerical foot not</paragraph></footnote><section ids="title-target" names="title\ target"><title>Title Target</title><image align="left" uri="test.png" width="100%"/><admonition classes="admonition-and-by-the-way"><title>And, by the way...</title><paragraph>You can make your own admonition too.</paragraph></admonition><bullet_list bullet="-"><list_item><paragraph>Bullet Item 1</paragraph></list_item><list_item><paragraph>Bullet Item 2</paragraph><block_quote><bullet_list bullet="-"><list_item><paragraph>Nested Bullet Item 2-1</paragraph></list_item><list_item><paragraph>Nested Bullet Item 2-2</paragraph></list_item></bullet_list></block_quote></list_item><list_item><paragraph>Bullet Item 3</paragraph><block_quote><bullet_list bullet="-"><list_item><paragraph>Nested Bullet Item 3-1</paragraph></list_item><list_item><paragraph>Nested Bullet Item 3-2</paragraph></list_item></bullet_list></block_quote></list_item></bullet_list><enumerated_list enumtype="arabic" prefix="" suffix="."><list_item><paragraph>Ordered Item 1</paragraph></list_item><list_item><paragraph>Ordered Item 2</paragraph><block_quote><enumerated_list enumtype="loweralpha" prefix="" suffix="."><list_item><paragraph>Nested Ordered Item 2-1</paragraph></list_item><list_item><paragraph>Nested Ordered Item 2-2</paragraph></list_item></enumerated_list></block_quote></list_item><list_item><paragraph>Ordered Item 3</paragraph><block_quote><enumerated_list enumtype="loweralpha" prefix="" suffix="."><list_item><paragraph>Nested Ordered Item 3-1</paragraph></list_item><list_item><paragraph>Nested Ordered Item 3-2</paragraph></list_item></enumerated_list></block_quote></list_item></enumerated_list></section></document>';

function createBlankBlock (type, depth) {
	return {
		depth: depth,
		entityRanges: [],
		inlineStyleRanges: [],
		text: '',
		type: type
	};
}


const TAG_HANDLERS = {
	'document': {
		NOOP: true
	},
	'paragraph': {
		isBlock: true,
		getBlock (node, depth) {
			return createBlankBlock(BLOCK_TYPE.UNSTYLED, depth);
		}
	},
	'strong': {
		isInlineStyle: true,
		type: INLINE_STYLE.BOLD
	},
	'emphasis': {
		isInlineStyle: true,
		type: INLINE_STYLE.ITALIC
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
		}
	}


	parseNodeChildren (node) {
		node.childNodes.forEach(x => this.parseNode(x));
	}


	parseBlockNode (handler, node) {
		if (this.hasOpenStyle || this.hasOpenEntity) {
			throw new Error('Parsing Block while there is an open style');
		}

		const depth = handler.getDepth ? handler.getDepth(node) : 0;
		const block = handler.getBlock(node, depth);

		this.blocks.push(block);

		this.currentBlock = block;

		this.parseNodeChildren(node);

		this.currentBlock = null;
	}


	parseInlineStyle (handler, node) {
		const currentBlock = this.currentBlock;

		if (!currentBlock) {
			throw new Error('Inline Style element outside of a block');
		}

		const style = {
			style: handler.type,
			offset: currentBlock.text.length
		};

		this.hasOpenStyle = true;

		currentBlock.inlineStyleRanges.push(style);

		this.parseNodeChildren(node);

		style.length = currentBlock.text.length - style.offset;

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
