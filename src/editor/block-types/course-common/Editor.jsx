import React from 'react';
import PropTypes from 'prop-types';

export default class CourseEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func
		})
	}

	attachCaptionRef = x => this.caption = x

	constructor (props) {
		super(props);

		this.state = this.getStateFor(props);
	}

	componentWillReceiveProps (nextProps) {
		const {block:newBlock} = nextProps;
		const {block:oldBlock} = this.props;

		if (newBlock !== oldBlock) {
			this.setState(this.getStateFor(nextProps));
		}
	}


	onRemove = () => {
		const {blockProps: {removeBlock}} = this.props;

		if (removeBlock) {
			removeBlock();
		}
	}


	onFocus = () => {
		const {blockProps: {setReadOnly}} = this.props;

		if (setReadOnly) {
			setReadOnly(true);
		}
	}


	onBlur = () => {
		const {blockProps: {setReadOnly}} = this.props;

		if (setReadOnly) {
			setReadOnly(false);
		}
	}


	onCaptionChange = (body, doNotKeepSelection) => {
		const {blockProps: {setBlockData}} = this.props;

		if (setBlockData) {
			setBlockData({body}, doNotKeepSelection);
		}
	}
}
