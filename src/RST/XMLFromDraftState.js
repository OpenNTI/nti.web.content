import {
	convertToRaw
} from 'draft-js';

import {BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE} from 'draft-js-utils';


const BLOCK_HANDLERS = {
	[BLOCK_TYPE.UNSTYLED]: {
		isBlock: true,
		tagName: 'paragraph'
	}
};


const STYLE_HANDLERS = {
	[INLINE_STYLE.BOLD]: {
		tagName: 'strong'
	},
	[INLINE_STYLE.ITALIC]: {
		tagName: 'emphasis'
	}
};


class DraftStateToXML {
	constructor (state) {
		this.dom = document.implementation.createDocument('', '', null);
		this.doc = this.dom.createElement('document');

		this.dom.appendChild(this.doc);

		this.blocks = state.blocks;
		this.entityMap = state.entityMap;
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
		}
	}


	parseBlock (handler, block) {
		const node = this.dom.createElement(handler.tagName);

		this.doc.appendChild(node);
		this.currentNode = node;

		this.parseBlockContent(handler, block, node);
	}

	parseBlockContent (handler, block, node) {
		//TODO sort and normalize styles and entities, for now assume they are sorted and just use style ranges
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
}



export default function parseDraftState (state) {
	const parser = new DraftStateToXML(convertToRaw(state));

	return parser.parse();
}
