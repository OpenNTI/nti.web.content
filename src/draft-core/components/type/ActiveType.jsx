import React from 'react';
import cx from 'classnames';

const stop = e => (e.preventDefault(), e.stopPropagation());

export default class ActiveType extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		onClick: React.PropTypes.func,
		getString: React.PropTypes.func
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			plugins: React.PropTypes.shape({
				currentBlockType: React.PropTypes.string
			})
		})
	}


	get getString () {
		const {getString} = this.props;

		return getString ? getString : x => x;
	}

	get editorContext () {
		return this.context.editorContext || {};
	}

	get pluginContext () {
		return this.editorContext.plugins || {};
	}

	get activeType () {
		const {currentBlockType} = this.pluginContext;

		return currentBlockType;
	}


	onMouseDown = (e) => {
		const {onClick} = this.props;

		if (onClick) {
			onClick();

			if (e) {
				e.preventDefault();
			}
		}
	}

	onClick = (e) => {
		const {onClick} = this.props;

		if (onClick) {
			stop(e);
		}
	}

	render () {
		const {className, ...otherProps} = this.props;
		const {activeType} = this;
		const cls = cx('draft-core-active-type', className, activeType, {empty: !activeType});

		delete otherProps.getString;
		delete otherProps.onClick;
		delete otherProps.onMouseDown;

		return (
			<div className={cls} onClick={this.onClick} onMouseDown={this.onMouseDown} {...otherProps}>
				<span>{activeType ? this.getString(activeType) : ''}</span>
			</div>
		);
	}
}
