import React from 'react';
import PropTypes from 'prop-types';

import {ContentResources} from 'nti-web-commons';

import Controls from '../Controls';

import FigureEditor from './FigureEditor';
import CaptionEditor from './CaptionEditor';


function fileIsImage (file) {
	return /image\//i.test(file.FileMimeType);
}


export default class CourseFigureEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
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


	onRemove = () => {
		const {blockProps: {removeBlock}} = this.props;

		if (removeBlock) {
			removeBlock();
		}
	}


	onChange = () => {
		const {blockProps: {course, setBlockData}} = this.props;
		const accept = x => !x.isFolder && fileIsImage(x);

		ContentResources.selectFrom(course.getID(), accept)
			.then((file) => {
				if (setBlockData) {
					setBlockData({arguments: file.url});
				}
			});
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


	onCaptionChange = (body) => {
		const {blockProps: {setBlockData}} = this.props;

		if (setBlockData) {
			setBlockData({body});
		}
	}


	render () {
		const {block} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-figure-editor" onMouseDown={this.onMouseDown}>
				<Controls onRemove={this.onRemove} onChange={this.onChange}/>
				<FigureEditor url={url} blockId={blockId} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
				/>
			</div>
		);
	}
}
