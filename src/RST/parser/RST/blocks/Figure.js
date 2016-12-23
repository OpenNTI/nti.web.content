import {BLOCK_TYPE} from 'draft-js-utils';

import Directive, {buildDirectiveRegex} from './Directive';

const FIGURE = buildDirectiveRegex('figure');

export default class Figure extends Directive {
	static isNextBlock (inputInterface) {
		const current = inputInterface.getInput(0);

		return FIGURE.test(current);
	}


	getOutput (context) {
		const output = {
			type: BLOCK_TYPE.ATOMIC,
			text: '',
			data: {
				type: 'figure',
				src: this.arguments,
				options: this.options
				//TODO: figure out how to parse and pass the body
				// caption: body[0] ? body[0].text : '',
				// body: body.slice(1).map(x => x.text)
			}
		};

		return {output, context};
	}
}
