import './Controls.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class BlockTypeControls extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onRemove: PropTypes.func,
		onChange: PropTypes.func,
		getString: PropTypes.func,
		iconName: PropTypes.string,
	};

	static defaultProps = {
		iconName: 'icon-image',
	};

	onRemove = e => {
		const { onRemove } = this.props;

		if (onRemove) {
			e.stopPropagation();

			onRemove();
		}
	};

	onChange = e => {
		const { onChange } = this.props;

		if (onChange) {
			e.stopPropagation();

			onChange();
		}
	};

	ChangeBodyComponent({ onChange, getString, iconName }) {
		if (onChange === null) {
			return null;
		}

		return (
			<div className="change" onClick={onChange}>
				<i className={iconName} />
				<span>{getString('Controls.changeImage')}</span>
			</div>
		);
	}

	render() {
		const { className, getString, onChange, iconName } = this.props;
		const cls = cx('custom-block-type-control', className);

		return (
			<div className={cls}>
				<div className="spacer" />
				<this.ChangeBodyComponent
					onChange={onChange}
					getString={getString}
					iconName={iconName}
				/>
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}
