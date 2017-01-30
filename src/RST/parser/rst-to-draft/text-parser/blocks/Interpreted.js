import {INLINE_STYLE} from 'draft-js-utils';

import Range from './Range';

const ROLE_MARKER = Symbol('Role Marker');

export default class Interpreted extends Range {
	static rangeName = 'interpreted'
	static openChars = '`'
	static closeChars = '`'

	static matchOpen (inputInterface) {
		const input = inputInterface.getInput(0);
		const nextInput = inputInterface.getInput(1);

		return {matches: input === '`' && nextInput !== '`'};
	}

	static matchClose (inputInterface) {
		const input = inputInterface.getInput(0);
		const nextInput = inputInterface.getInput(1);

		return {
			matches: input === '`' && nextInput !== '`',
			nextChar: nextInput === '_' ? inputInterface.getInput(2) : nextInput //if the next char is an _ we need to look at the char after to determine if its a valid close
		};
	}

	static afterParse (block, inputInterface, context, currentBlock) {
		if (currentBlock && (currentBlock.isRole || currentBlock.isTarget)) {
			block.setRoleMarker(currentBlock);
			currentBlock.setMarkerFor(block);
		}

		return block;
	}


	isInterpreted = true

	get roleMarker () {
		return this[ROLE_MARKER];
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
