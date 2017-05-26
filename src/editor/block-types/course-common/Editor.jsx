export const attachCaptionRef = x => this.caption = x;


export function onRemove (props) {
	const {blockProps: {removeBlock}} = props;

	if (removeBlock) {
		removeBlock();
	}
}


export function onFocus (props) {
	const {blockProps: {setReadOnly}} = props;

	if (setReadOnly) {
		setReadOnly(true);
	}
}


export function onBlur (props) {
	const {blockProps: {setReadOnly}} = props;

	if (setReadOnly) {
		setReadOnly(false);
	}
}


export function onCaptionChange (body, doNotKeepSelection, props) {
	const {blockProps: {setBlockData}} = props;

	if (setBlockData) {
		setBlockData({body}, doNotKeepSelection);
	}
}
