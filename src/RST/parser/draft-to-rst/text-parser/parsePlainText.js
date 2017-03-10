export default function (block) {
	const {text} = block;

	//We need to trim the leading white space to prevent RST from
	//thinking its a different format. Trimming the trailing whitespace
	//shouldn't cause any problems so go ahead and do that too
	return text.trim();
}
