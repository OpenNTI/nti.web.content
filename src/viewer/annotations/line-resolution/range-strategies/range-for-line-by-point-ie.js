export default {
	shouldUse: () => typeof TextRange !== 'undefined' && TextRange.prototype.moveToPoint,//eslint-disable-line

	computeRange: () => {

	}
};
