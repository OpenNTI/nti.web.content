import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

const MARKER_FOR = Symbol('Marker For');

function buildStyleRange (style, context, block) {
	return {style, offset: context.charCount, length: block.length};
}

const ROLES = {
	emphasis: (context, block) => {
		return {
			inlineStyleRanges: [buildStyleRange(INLINE_STYLE.ITALIC, context, block)]
		};
	},

	strong: (context, block) => {
		return {
			inlineStyleRanges: [buildStyleRange(INLINE_STYLE.BOLD, context, block)]
		};
	},

	math: (context, block) => {
		return {
			inlineStyleRanges: [buildStyleRange(INLINE_STYLE.CODE, context, block)]
		};
	},

	bolditalic: (context, block) => {
		return {
			inlineStyleRanges: [
				buildStyleRange(INLINE_STYLE.BOLD, context, block),
				buildStyleRange(INLINE_STYLE.ITALIC, context, block)
			]
		};
	},

	boldunderlined: (context, block) => {
		return {
			inlineStyleRanges: [
				buildStyleRange(INLINE_STYLE.BOLD, context, block),
				buildStyleRange(INLINE_STYLE.UNDERLINE, context, block)
			]
		};
	},

	italicunderlined: (context, block) => {
		return {
			inlineStyleRanges: [
				buildStyleRange(INLINE_STYLE.ITALIC, context, block),
				buildStyleRange(INLINE_STYLE.UNDERLINE, context, block)
			]
		};
	},

	bolditalicunderlined: (context, block) => {
		return {
			inlineStyleRanges: [
				buildStyleRange(INLINE_STYLE.BOLD, context, block),
				buildStyleRange(INLINE_STYLE.ITALIC, context, block),
				buildStyleRange(INLINE_STYLE.UNDERLINE, context, block)
			]
		};
	}
};

export default class Role extends Range {
	static sequence = [':']
	static rangeName = 'role'

	static afterParse (block, inputInterface, context, currentBlock) {
		if (currentBlock && currentBlock.isInterpreted) {
			currentBlock.setRoleMaker(block);
			block.setMarkerFor(currentBlock);
		}

		return block;
	}

	isRole = true

	get name () {
		return this.text;
	}

	setMarkerFor (block) {
		this[MARKER_FOR] = block;
	}

	getOutput (context) {
		return this[MARKER_FOR] && this[MARKER_FOR].isValidRange && this.closed ? null : this.getPlaintextOutput(context);
	}


	getRanges (context, block) {
		const fn = ROLES[this.name];

		if (!fn) {
			//TODO: figure out what to do for this case;
			return {};
		}

		return fn(context, block);
	}
}
