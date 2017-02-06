export default function (inputContext) {
	const {input, context} = inputContext;

	return {input: input.split('\n'), context};
}
