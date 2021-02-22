import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { ContentResources } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import {
	CaptionEditor,
	Controls,
	onRemove,
	onFocus,
	onBlur,
	onCaptionChange,
} from '../course-common';

import FigureEditor from './FigureEditor';

const DEFAULT_TEXT = {
	Editor: {
		figureTitle: 'Figure %(index)s',
		descriptionPlaceholder: 'Write a caption...',
	},
	Controls: {
		changeImage: 'Replace Image',
	},
};

const getString = scoped(
	'web-content.editor.block-types.course-figure.FigureEditor',
	DEFAULT_TEXT
);

function fileIsImage(file) {
	return /image\//i.test(file.FileMimeType);
}

const blockType = {
	getString,
	regex: /^Figure\s\d$/,
	getTitle: index => getString('Editor.figureTitle', { index: index + 1 }),
};

export default class CourseFigureEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func,
			course: PropTypes.shape({
				getID: PropTypes.func,
			}),
		}),
	};

	attachCaptionRef = x => (this.caption = x);

	get blockData() {
		return this.props.block?.getData?.();
	}

	get url() {
		return this.blockData?.get('arguments');
	}

	get body() {
		const body = this.blockData?.get('body');

		return body.toJS ? body.toJS() : body;
	}

	onChange = () => {
		const {
			blockProps: { course, setBlockData },
		} = this.props;
		const accept = x => !x.isFolder && fileIsImage(x);

		ContentResources.selectFrom(course.getID(), accept).then(file => {
			if (setBlockData) {
				setBlockData({ arguments: file.url });
			}
		});
	};

	onClick = e => {
		e.stopPropagation();

		if (this.caption) {
			this.caption.focus();
		}
	};

	onRemove = () => onRemove(this.props);
	onFocus = () => onFocus(this.props);
	onBlur = () => onBlur(this.props);
	onCaptionChange = (body, doNotKeepSelection) =>
		onCaptionChange(body, doNotKeepSelection, this.props);

	render() {
		const {
			block,
			blockProps: { indexOfType },
		} = this.props;
		const { url, body } = this;
		const blockId = block.getKey();

		return (
			<div className="course-figure-editor" onClick={this.onClick}>
				<Controls
					onRemove={this.onRemove}
					onChange={this.onChange}
					getString={getString}
				/>
				<FigureEditor
					url={url}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
				/>
				<CaptionEditor
					ref={this.attachCaptionRef}
					body={body}
					blockId={blockId}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onCaptionChange}
					indexOfType={indexOfType}
					blockType={blockType}
				/>
			</div>
		);
	}
}
