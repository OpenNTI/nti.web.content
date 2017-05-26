export const attachCaptionRef = x => this.caption = x;


export const onRemove = props => {
	const {blockProps: {removeBlock}} = props;

	if (removeBlock) {
		removeBlock();
	}
}


export const onFocus = props => {
	const {blockProps: {setReadOnly}} = props;

	if (setReadOnly) {
		setReadOnly(true);
	}
}


export const onBlur = props => {
	const {blockProps: {setReadOnly}} = props;

	if (setReadOnly) {
		setReadOnly(false);
	}
}


export const onCaptionChange = (body, doNotKeepSelection, props) => {
	const {blockProps: {setBlockData}} = props;

	if (setBlockData) {
		setBlockData({body}, doNotKeepSelection);
	}
}
