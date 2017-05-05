import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class BlockTypeControls extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onRemove: PropTypes.func
	}


	onRemove = () => {
		const {onRemove} = this.props;

		if (onRemove) {
			onRemove();
		}
	}


	render () {
		const {className} = this.props;
		const cls = cx('custom-block-type-control', className);

		return (
			<div className={cls}>
				<div className="spacer" />
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}
