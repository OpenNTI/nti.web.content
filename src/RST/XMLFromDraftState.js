import {
	convertToRaw
} from 'draft-js';

import {BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE} from 'draft-js-utils';


const BLOCK_HANDLERS = {
	[BLOCK_TYPE.UNSTYLED]: {
		isBlock: true,
		tagName: 'paragraph'
	},
	[BLOCK_TYPE.HEADER_ONE]: {
		isHeading: true,
		isTitle: true,
		depth: 0
	},
	[BLOCK_TYPE.HEADER_TWO]: {
		isHeading: true,
		depth: 1
	},
	[BLOCK_TYPE.HEADER_THREE]: {
		isHeading: true,
		depth: 2
	},
	[BLOCK_TYPE.HEADER_FOUR]: {
		isHeading: true,
		depth: 3
	},
	[BLOCK_TYPE.HEADER_FIVE]: {
		isHeading: true,
		depth: 4
	},
	[BLOCK_TYPE.HEADER_SIX]: {
		isHeading: true,
		depth: 5
	}
};


const STYLE_HANDLERS = {
	[INLINE_STYLE.BOLD]: {
		tagName: 'strong'
	},
	[INLINE_STYLE.ITALIC]: {
		tagName: 'emphasis'
	},
	[INLINE_STYLE.CODE]: {
		tagName: 'math'
	},
};


class DraftStateToXML {
	constructor (state) {
		this.dom = document.implementation.createDocument('', '', null);
		this.doc = this.dom.createElement('document');

		this.dom.appendChild(this.doc);

		this.currentNode = this.doc;

		this.blocks = state.blocks;
		this.entityMap = state.entityMap;

		this.sections = [this.doc];
	}


	parse () {
		for (let block of this.blocks) {
			this.parseContentBlock(block);
		}

		return (new XMLSerializer()).serializeToString(this.dom);
	}


	parseContentBlock (block) {
		const handler = BLOCK_HANDLERS[block.type];

		if (!handler) {
			//TODO handle this case somehow
		} else if (handler.isBlock) {
			this.parseBlock(handler, block);
		} else if (handler.isHeading) {
			this.parseHeading(handler, block);
		}
	}


	parseBlock (handler, block) {
		const node = this.dom.createElement(handler.tagName);

		this.currentNode.appendChild(node);

		this.parseBlockContent(handler, block, node);
	}

	parseBlockContent (handler, block, node) {
		//TODO sort, collapse, and normalize styles and entities, for now assume they are sorted and just use style ranges
		const ranges = block.inlineStyleRanges;
		const content = block.text;
		let position = 0;


		for (let range of ranges) {
			let plainText = content.substring(position, range.offset);

			if (plainText) {
				node.appendChild(this.dom.createTextNode(plainText));
			}

			let style = STYLE_HANDLERS[range.style];
			let endIndex = range.offset + range.length;
			let styledText = content.substring(range.offset, endIndex);

			if (styledText && style) {
				let s = this.dom.createElement(style.tagName);

				s.innerHTML = styledText;

				node.appendChild(s);
			}

			position = endIndex;
		}

		if (position < content.length) {
			let plainText = content.substring(position, content.length);

			node.appendChild(this.dom.createTextNode(plainText));
		}
	}


	parseHeading (handler, block) {
		if (handler.isTitle) {
			const title = this.dom.createElement('title');

			this.currentNode.appendChild(title);

			this.parseBlockContent(handler, block, title);
			return;
		}

		if (handler.depth <= this.sectionDepth) {
			this.sections.pop();
			this.currentNode = this.sections[this.sections.length - 1];
		}

		const section = this.dom.createElement('section');
		const title = this.dom.createElement('title');

		section.appendChild(title);

		this.currentNode.appendChild(section);

		this.parseBlockContent(handler, block, title);

		this.sections.push(section);
		this.currentNode = section;
		this.sectionDepth = handler.depth;
	}
}



export default function parseDraftState (state) {
	const parser = new DraftStateToXML(convertToRaw(state));

	return parser.parse();
}
