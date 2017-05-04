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


	render () {
		const {block} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-figure-editor">
				<FigureEditor url={url} blockId={blockId} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor body={body} blockId={blockId} onFocus={this.onFocus} onBlur={this.onBlur} />
			</div>
		);
	}
}
