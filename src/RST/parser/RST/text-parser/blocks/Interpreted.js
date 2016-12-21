import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

const ROLE_MARKER = Symbol('Role Marker');
const IS_CONSUMED = Symbol('Consumed');

export default class Interpreted extends Range {
	static sequence = ['`', /[^`]/]
	static rangeName = 'interpreted'

	static getSequenceLength () {
		return 1;
	}

	static afterParse (block, inputInterface, context, currentBlock) {
		if (currentBlock && currentBlock.isRole) {
			block.setRoleMarker(currentBlock);
			currentBlock.setMarkerFor(block);
		}

		return block;
	}


	isInterpreted = true


	consume () {
		this[IS_CONSUMED] = true;
	}


	get isConsumed () {
		return this[IS_CONSUMED];
	}


	setRoleMarker (role) {
		this[ROLE_MARKER] = role;
	}


	getOutput (context, force) {
		if (this[ROLE_MARKER] && !force) {
			return this[ROLE_MARKER].getOutputForInterpreted(this, context);
		}

		return super.getOutput(context);
	}


	getRanges (context) {
		if (this[ROLE_MARKER]) { return {}; }

		const range = {style: INLINE_STYLE.CODE, offset: context.charCount, length: this.length};

		return {
			inlineStyleRanges: [range]
		};
	}
}
