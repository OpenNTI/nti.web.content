import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Plugins} from '../../../draft-core';

const {Button, BlockCount} = Plugins.InsertBlock.components;

export default class BlockTypeButton extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		iconClass: PropTypes.string,
		label: PropTypes.string,
		createBlock: PropTypes.func,
		createBlockProps: PropTypes.object,
		isBlockPredicate: PropTypes.func,
		attachPluginRef: PropTypes.func
	}


	state = {};

	onMouseDown = () => this.setState({
		mousedown: true
	})

	onMouseUp = () => this.setState({
		mousedown: false
	})

	render () {
		const {
			className,
			iconClass,
			label,
			createBlock,
			createBlockProps,
			isBlockPredicate,
			attachPluginRef
		} = this.props;
		const {mousedown} = this.state;

		return (
			<Button
				ref={attachPluginRef}
				className={cx('content-editor-block-type-button', className, {mousedown})}
				createBlock={createBlock}
				createBlockProps={createBlockProps}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onDragEnd={this.onMouseUp}
			>
				<BlockCount className="used" predicate={isBlockPredicate} />
				<span className={cx('icon', iconClass)} />
				<span className="label">{label}</span>
			</Button>
		);
	}
}
