import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		createBlock: PropTypes.func,
		isBlockFor: PropTypes.func
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
		debugger;
	}


	render () {
		return (
			<div onClick={this.onClick}>
				<span>Insert Block</span>
			</div>
		);
	}
}
