import Parser from '../Parser';

import {
	Header,
	Text,
	Empty,
	ExternalHyperLink
} from './blocks';

export default class RSTToDraftState extends Parser {

	getBlockClasses () {
		return [
			Empty,
			Header,
			ExternalHyperLink,
			Text
		];
	}


	parseBlocksFromInput (input) {
		return input.split('\n');
	}
}
