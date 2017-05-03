import React from 'react';
import PropTypes from 'prop-types';

import PreventStealingFocus from '../../../components/PreventStealingFocus';

export default class Button extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		createBlock: PropTypes.func,
		createBlockProps: PropTypes.object,
		children: PropTypes.node
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				insertBlock: React.PropTypes.func,
				allowInsertBlock: React.PropTypes.bool
			})
		})
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
		const {insertBlock} = this.pluginContext;
		const {createBlock, createBlockProps} = this.props;

		if (insertBlock && createBlock) {
			createBlock(insertBlock, createBlockProps);
		}
	}


	render () {
		const {children} = this.props;

		return (
			<PreventStealingFocus>
				<div onClick={this.onClick}>
					{children}
				</div>
			</PreventStealingFocus>
		);
	}
}
