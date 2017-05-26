import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

export default class BlockTypeControls extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onRemove: PropTypes.func,
		onChange: PropTypes.func,
		getString: PropTypes.func
	}


	onRemove = (e) => {
		const {onRemove} = this.props;

		if (onRemove) {
			e.stopPropagation();

			onRemove();
		}
	}


	onChange = (e) => {
		const {onChange} = this.props;

		if (onChange) {
			e.stopPropagation();

			onChange();
		}
	}


	ChangeBodyComponent ({onChange, getString}) {
		if (onChange === null) {
			return null;
		}

		return (
			<div className="change" onClick={onChange}>
				<i className="icon-image" />
				<span>{getString('Controls.changeImage')}</span>
			</div>
		);
	}


	render () {
		const {className, getString, onChange} = this.props;
		const cls = cx('custom-block-type-control', className);

		return (
			<div className={cls}>
				<div className="spacer" />
				<this.ChangeBodyComponent onChange={onChange} getString={getString} />
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}
