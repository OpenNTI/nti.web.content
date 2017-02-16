import React from 'react';
import cx from 'classnames';

export default class ActiveType extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		onClick: React.PropTypes.func,
		getString: React.PropTypes.func
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			editor: React.PropTypes.object,
			currentBlockType: React.PropTypes.string
		})
	}


	get getString () {
		const {getString} = this.props;

		return getString ? getString : x => x;
	}

	get editorContext () {
		return this.context.editorContext || {};
	}

	get activeType () {
		const {currentBlockType} = this.editorContext;

		return currentBlockType;
	}


	onClick = () => {
		const {onClick} = this.props;
		const {editorContext} = this.context;
		const {editor} = editorContext || {};

		if (onClick) {
			onClick();

			if (editor) {
				editor.focus();
			}
		}
	}

	render () {
		const {className, ...otherProps} = this.props;
		const {activeType} = this;
		const cls = cx('draft-core-active-type', className, activeType, {empty: !activeType});

		delete otherProps.getString;
		delete otherProps.onClick;

		return (
			<div className={cls} onClick={this.onClick} {...otherProps}>
				<span>{activeType ? this.getString(activeType) : ''}</span>
			</div>
		);
	}
}
