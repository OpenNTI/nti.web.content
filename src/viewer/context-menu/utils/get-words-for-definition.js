const PUNCUATION_REGEX = /^[^\w]+|[^\w]+$/g;
const ONE_OR_TWO_WORDS_REGEX = /^\w+$|^\w+[^\w]+\w+$/i;

export default function getWordsForDefinition (userSelection) {
	const {range} = userSelection;

	if (!range) { return ''; }

	const text = range
		.toString()
		.trim()
		.replace(PUNCUATION_REGEX, '');

	return ONE_OR_TWO_WORDS_REGEX.test(text) ? text : '';
}
