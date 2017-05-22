import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


export default class BlockCount extends React.Component {
	static propTypes = {
		predicate: PropTypes.func,
		className: PropTypes.string
	}


	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				getInsertBlockCount: React.PropTypes.func
			})
		})
	}


	get editorContext () {
		return this.context.editorContext || {};
	}


	get pluginContext () {
		return this.editorContext.plugins || {getInsertBlockCount: () => 0};
	}


	get blockCount () {
		const {predicate} = this.props;
		const {getInsertBlockCount} = this.pluginContext;

		return getInsertBlockCount ? getInsertBlockCount(predicate) : 0;
	}


	render () {
		const {className} = this.props;
		const {blockCount} = this;
		const cls = cx('insert-block-count', className, {isUsed: blockCount > 0});

		return !blockCount ? null : (
			<div className={cls}>
				{blockCount}
			</div>
		);
	}
}
