import React from 'react';
import cx from 'classnames';

export default class ActiveType extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		getString: React.PropTypes.func
	}

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			currentBlockType: React.PropTypes.string
		})
	}

	get activeType () {
		const {editorContext: {currentBlockType}} = this.context;

		return currentBlockType;
	}

	render () {
		const {className} = this.props;
		const {activeType} = this;
		const cls = cx('draft-core-active-type', className, activeType);

		return (
			<div className={cls}>
				<span>{activeType}</span>
			</div>
		);
	}
}
