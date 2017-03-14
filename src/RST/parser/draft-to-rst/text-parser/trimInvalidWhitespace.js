const LEADING_WHITE_SPACE = /^\s*/;

//Leading white space can cause the rst to be parsed as something else
//so for now trim it to prevent parsing errors
export default function trimInvalidWhitespace (text) {
	return text.replace(LEADING_WHITE_SPACE, '');
}
