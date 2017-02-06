export default function (inputContext) {
	const {input, context} = inputContext;
	const {blocks, entityMap} = input;

	return {input:blocks, context: {...context, entityMap}};
}
