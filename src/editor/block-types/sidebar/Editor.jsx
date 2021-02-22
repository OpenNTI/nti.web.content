import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';

import TitleEditor from './parts/TitleEditor';
import BodyEditor from './parts/BodyEditor';

function getBodyFromBlock(block) {
	const data = block.get('data');
	const body = data.get('body') || [];

	return body.join('\n');
}

function getTitleFromBlock(block) {
	const data = block.get('data');

	return data.get('arguments') || '';
}

export default class NTISidebar extends React.Component {
	static getBodyFromBlock = getBodyFromBlock;

	static propTypes = {
		block: PropTypes.object,
		blockProps: PropTypes.shape({
			setReadOnly: PropTypes.func,
			setBlockData: PropTypes.func,
			removeBlock: PropTypes.func,
		}),
	};

	state = { body: '', title: '' };

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { block: oldBlock } = prevProps;
		const { block: newBlock } = this.props;

		if (oldBlock !== newBlock) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { block } = this.props;

		this.setState({
			body: getBodyFromBlock(block),
			title: getTitleFromBlock(block),
		});
	}

	setReadOnly = (...args) => {
		// const {blockProps: {setReadOnly}} = this.props;
		// if (setReadOnly) {
		// 	setReadOnly(...args);
		// }
	};

	onBodyChange = value => {
		const {
			blockProps: { setBlockData },
		} = this.props;

		if (setBlockData) {
			setBlockData(
				{
					body: value.split('\n'),
				},
				true
			);
		}
	};

	onTitleChange = value => {
		const {
			blockProps: { setBlockData },
		} = this.props;

		if (setBlockData) {
			setBlockData(
				{
					arguments: value,
				},
				true
			);
		}
	};

	onRemove = () => {
		const {
			blockProps: { removeBlock },
		} = this.props;

		if (removeBlock) {
			removeBlock();
		}
	};

	render() {
		const { block } = this.props;
		const { body, title } = this.state;
		const blockId = block.getKey();

		return (
			<div className="content-editing-sidebar-editor">
				<div className="controls">
					<div className="spacer" />
					<div className="remove" onClick={this.onRemove}>
						<i className="icon-bold-x" />
					</div>
				</div>
				<TitleEditor
					value={title}
					blockId={blockId}
					onChange={this.onTitleChange}
					setReadOnly={this.setReadOnly}
				/>
				<BodyEditor
					value={body}
					blockId={blockId}
					onChange={this.onBodyChange}
					setReadOnly={this.setReadOnly}
				/>
			</div>
		);
	}
}
