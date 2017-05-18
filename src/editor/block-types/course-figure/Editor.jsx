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


	getStateFor (props = this.props) {
		const {block} = props;
		const data = block.getData();
		const body = data.get('body');

		return {
			url: data.get('arguments'),
			body: body.toJS ? body.toJS() : body
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


	onCaptionChange = (body, doNotKeepSelection) => {
		const {blockProps: {setBlockData}} = this.props;

		if (setBlockData) {
			setBlockData({body}, doNotKeepSelection);
		}
	}

	onClick = (e) => {
		e.stopPropagation();

		if (this.caption) {
			this.caption.focus();
		}
	}


	render () {
		const {block, blockProps:{indexOfType}} = this.props;
		const {url, body} = this.state;
		const blockId = block.getKey();

		return (
			<div className="course-figure-editor" onClick={this.onClick}>
				<Controls onRemove={this.onRemove} onChange={this.onChange}/>
				<FigureEditor url={url} blockId={blockId} onFocus={this.onFocus} onBlur={this.onBlur} />
				<CaptionEditor
					ref={this.attachCaptionRef}
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
					indexOfType={indexOfType}
				/>
			</div>
		);
	}
}
