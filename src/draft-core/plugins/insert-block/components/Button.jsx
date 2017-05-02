import React from 'react';
import PropTypes from 'prop-types';

import PreventStealingFocus from '../../../components/PreventStealingFocus';

export default class Button extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		createBlock: PropTypes.func,
		children: PropTypes.node
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				insertBlock: React.PropTypes.func.isRequired,
				allowInsertBlock: React.PropTypes.object
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
		const {createBlock} = this.props;

		if (insertBlock && createBlock) {
			createBlock(insertBlock);
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
