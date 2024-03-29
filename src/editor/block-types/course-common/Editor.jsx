export function onRemove(props) {
	const {
		blockProps: { removeBlock, setReadOnly },
	} = props;

	if (removeBlock) {
		removeBlock();
	}

	if (setReadOnly) {
		setReadOnly(false);
	}
}

export function onFocus(props) {
	const {
		blockProps: { setReadOnly },
	} = props;

	if (setReadOnly) {
		setReadOnly(true);
	}
}

export function onBlur(props) {
	const {
		blockProps: { setReadOnly },
	} = props;

	if (setReadOnly) {
		setReadOnly(false);
	}
}

export function onCaptionChange(body, doNotKeepSelection, props) {
	const {
		blockProps: { setBlockData },
	} = props;

	if (setBlockData) {
		setBlockData({ body }, doNotKeepSelection);
	}
}
