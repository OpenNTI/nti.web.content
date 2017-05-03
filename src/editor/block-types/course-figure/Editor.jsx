import React from 'react';
import PropTypes from 'prop-types';

import FigureEditor from './FigureEditor';
import CaptionEditor from './CaptionEditor';

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

		return {
			url: data.get('arguments'),
			body: data.get('body')
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
		const {url, body} = this.state;

		return (
			<div className="course-figure-editor">
				<FigureEditor url={url} />
				<CaptionEditor body={body} />
			</div>
		);
	}
}
