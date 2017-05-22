import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

export default class BlockTypeControls extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onRemove: PropTypes.func,
		onChange: PropTypes.func,
		t: PropTypes.func.isRequired
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


	render () {
		const {className, t, iconName} = this.props;
		const cls = cx('custom-block-type-control', className);

		const changeBodyComponent = ({onChange, t}) => onChange === null ?
			null :
			(
				<div className="change" onClick={onChange}>
					<i className="icon-image" />
					<span>{t('change')}</span>
				</div>
			);

		return (
			<div className={cls}>
				<div className="spacer" />
				<changeBodyComponent onChange={this.onChange} t={t} />
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}
