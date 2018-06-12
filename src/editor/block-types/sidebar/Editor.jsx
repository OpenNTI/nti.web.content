import React from 'react';
import PropTypes from 'prop-types';

import BodyEditor from './parts/BodyEditor';

function getBodyFromBlock (block) {
	const data = block.get('data');
	const body = data.get('body') || [];

	return body.join('\n');
}

export default class NTISidebar extends React.Component {
	static propTypes = {
		block: PropTypes.object,
		blockId: PropTypes.string,
		blockProps: PropTypes.shape({
			setReadOnly: PropTypes.func,
			setBlockData: PropTypes.func
		})
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}

	componentDidUpdate (prevProps) {
		const {block:oldBlock} = prevProps;
		const {block:newBlock} = this.props;

		if (oldBlock !== newBlock) {
			this.setupFor(this.props);
		}
	}

	setupFor (props) {
		const {block} = this.props;

		this.setState({
			body: getBodyFromBlock(block)
		});
	}


	setReadOnly = (...args) => {
		const {blockProps: {setReadOnly}} = this.props;

		if (setReadOnly) {
			setReadOnly(...args);
		}
	}


	onBodyChange = (value) => {
		const {blockProps: {setBlockData}} = this.props;

		if (setBlockData) {
			setBlockData({
				body: value.split('\n')
			});
		}
	}


	render () {
		const {blockId} = this.props;
		const {body} = this.state;

		return (
			<div className="content-editing-sidebar-editor">
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
