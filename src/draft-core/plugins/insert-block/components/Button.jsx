import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import {DnD} from 'nti-web-commons';

import {DRAG_DATA_TYPE} from '../Constants';

// import PreventStealingFocus from '../../../components/PreventStealingFocus';

export default class Button extends React.Component {
	static propTypes = {
		createBlock: PropTypes.func,
		createBlockProps: PropTypes.object,
		children: PropTypes.node
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				getInsertMethod: React.PropTypes.func,
				allowInsertBlock: React.PropTypes.bool,
				registerInsertHandler: React.PropTypes.func,
				unregisterInsertHandler: React.PropTypes.func
			})
		})
	}


	constructor (props) {
		super(props);

		this.dragInsertionId = uuid();
	}


	get editorContext () {
		return this.context.editorContext || {};
	}


	get pluginContext () {
		return this.editorContext.plugins || {};
	}


	get isAllowed () {
		return this.pluginContext.allowInsertBlock;
	}


	onClick = () => {
		this.handleInsertion();
	}


	handleInsertion = (selection) => {
		const {getInsertMethod} = this.pluginContext;
		const {createBlock, createBlockProps} = this.props;

		if (getInsertMethod && createBlock) {
			createBlock(getInsertMethod(selection), createBlockProps);
		}
	}


	onDragStart = () => {
		const {registerInsertHandler} = this.pluginContext;

		if (registerInsertHandler) {
			registerInsertHandler(this.dragInsertionId, this.handleInsertion);
		}
	}


	onDragEnd = () => {
		const {unregisterInsertHandler} = this.pluginContext;

		if (unregisterInsertHandler) {
			unregisterInsertHandler(this.dragInsertionId);
		}
	}


	render () {
		const {children, ...otherProps} = this.props;
		const data = [
			{dataTransferKey: DRAG_DATA_TYPE, dataForTransfer: this.dragInsertionId},
			{dataTransferKey: 'text', dataForTransfer: ''}
		];

		delete otherProps.createBlock;
		delete otherProps.createBlockProps;

			// <PreventStealingFocus onClick={this.onClick} {...otherProps}>
			// </PreventStealingFocus>
		return (
			<DnD.Draggable data={data} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
				<div onClick={this.onClick} {...otherProps}>
					{children}
				</div>
			</DnD.Draggable>
		);
	}
}
