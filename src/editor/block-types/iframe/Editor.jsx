import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import { IFRAME_DELETED_EVENT, addListener, removeListener } from '../Events';
import {
	Controls,
	onRemove,
	onFocus,
	onBlur,
	onCaptionChange,
} from '../course-common';

import IframeEditor from './IframeEditor';
import IframePicker from './Picker';

const DEFAULT_TEXT = {
	Editor: {
		iframeTitle: 'Iframe %(index)s',
		descriptionPlaceholder: 'Write a caption...',
	},
	Controls: {
		changeImage: 'Edit Iframe',
	},
};

const getString = scoped(
	'web-content.editor.block-types.iframe.IframeEditor',
	DEFAULT_TEXT
);

const BannedBodyParts = {
	':width:': true,
	':height:': true
};

export default class CourseIframeEditor extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			indexOfType: PropTypes.number,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
			setReadOnly: PropTypes.func,
		}),
	};

	onChange = null;

	attachCaptionRef = x => (this.caption = x);

	constructor(props) {
		super(props);

		this.state = this.getStateFor(props);
	}

	componentDidMount() {
		this.maybeFixBlock();
		addListener(IFRAME_DELETED_EVENT, this.onDelete);
	}

	componentWillUnmount() {
		removeListener(IFRAME_DELETED_EVENT, this.onDelete);
	}

	onDelete = iframeId => {
		const { block } = this.props;
		const data = block.getData();
		const iframeNTIID = data.get('arguments');

		if (iframeId === iframeNTIID) {
			this.onRemove();
		}
	};

	getStateFor(props = this.props) {
		const { block } = props;
		const data = block.getData();
		const body = data.get('body');
		let options = data.get('options');

		const iframeObj = {
			src: data.get('arguments'),
			attributes: options.toJS ? options.toJS() : options,
		};

		return {
			iframeObj,
			body: body.toJS ? body.toJS() : body,
		};
	}

	componentDidUpdate(prevProps) {
		const { block: oldBlock } = prevProps;
		const { block: newBlock } = this.props;

		if (oldBlock !== newBlock) {
			this.maybeFixBlock();
			this.setState(this.getStateFor());
		}
	}

	maybeFixBlock () {
		const {blockProps: {setBlockData}} = this.props;
		const {iframeObj, body} = this.getStateFor(this.props);
		const hasBanned = body.some(p => BannedBodyParts[p]);

		if (setBlockData && hasBanned) {
			setBlockData({
				name: 'nti:embedwidget',
				body: body.filter(p => !BannedBodyParts[p]),
				arguments: iframeObj.src,
				options: {width: void 0, height: void 0, ...iframeObj.attributes}
			});
		}
	}

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

	onChange = () => {
		const {
			blockProps: { setBlockData },
		} = this.props;
		const { iframeObj } = this.state;

		IframePicker.show(iframeObj)
			.then(iframeObjEdit => {
				if (setBlockData) {
					setBlockData({
						name: 'nti:embedwidget',
						body: [],
						arguments: iframeObjEdit.src,
						options: iframeObjEdit.attributes,
					});
				}
			})
			.catch(e => {});
	};

	onClick = e => {
		e.stopPropagation();
	};

	render() {
		const { iframeObj } = this.state;

		return (
			<div className="course-iframe-editor" onClick={this.onClick}>
				<Controls
					onRemove={this.onRemove}
					onChange={this.onChange}
					getString={getString}
					iconName="icon-edit"
				/>
				<IframeEditor iframeObj={iframeObj} />
			</div>
		);
	}
}
