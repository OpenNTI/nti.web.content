import React from 'react';
import PropTypes from 'prop-types';

export default class CourseFigureEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			setBlockData: PropTypes.func,
			setReadOnly: PropTypes.func
		})
	}

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


	getStateFor (props = this.props) {
		const {block} = props;
		const data = block.getData();
		const body = data.get('body');
		const file = data.get('arguments');
		const title = body[0];

		return {
			title,
			file
		};
	}


	onTitleChange = (e) => {
		const {blockProps: {setBlockData}, block} = this.props;
		const data = block.getData();
		const body = data.get('body');

		const newBody = [e.target.value, body[1]];

		setBlockData({
			body: newBody
		});
	}


	onTitleFocus = () => {
		const {blockProps: {setReadOnly}} = this.props;

		if (setReadOnly) {
			setReadOnly(true);
		}
	}


	onTitleBlur = () => {
		const {blockProps: {setReadOnly}} = this.props;

		if (setReadOnly) {
			setReadOnly(false);
		}
	}


	render () {
		const {title, file} = this.state;

		return (
			<div>
				<span>{title || ''}</span>
				<img src={file} />
				<input
					type="text"
					value={title}
					onChange={this.onTitleChange}
					onFocus={this.onTitleFocus}
					onBlur={this.onTitleBlur}
				/>
			</div>
		);
	}
}
