import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

const MARKER_FOR = Symbol('Marker For');

function buildStyleRange (style, block, context) {
	return {style, offset: context.charCount, length: block.length};
}


function buildOutput (styles, block, context) {
	const inlineStyleRanges = styles.map(x => buildStyleRange(x, block, context));
	const {output, context:newContext} = block.getOutput(context, true);

	newContext.inlineStyleRanges = (newContext.inlineStyleRanges || []).concat(inlineStyleRanges);

	return {output, context: newContext};
}


const ROLES = {
	emphasis: (block, context) => {
		return buildOutput([INLINE_STYLE.ITALIC], block, context);
	},

	strong: (block, context) => {
		return buildOutput([INLINE_STYLE.BOLD], block, context);
	},

	math: (block, context) => {
		return buildOutput([INLINE_STYLE.CODE], block, context);
	},

	bolditalic: (block, context) => {
		return buildOutput([INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC], block, context);
	},

	boldunderlined: (block, context) => {
		return buildOutput([INLINE_STYLE.BOLD, INLINE_STYLE.UNDERLINE], block, context);
	},

	italicunderlined: (block, context) => {
		return buildOutput([INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE], block, context);
	},

	bolditalicunderlined: (block, context) => {
		return buildOutput([INLINE_STYLE.BOLD, INLINE_STYLE.ITALIC, INLINE_STYLE.UNDERLINE], block, context);
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


	getOutputForInterpreted (block, context) {
		const fn = ROLES[this.name];

		if (!fn) {
			//TODO: warn or something here
			return block.getOutput(context, true);
		}

		return fn(block, context);
	}
}
