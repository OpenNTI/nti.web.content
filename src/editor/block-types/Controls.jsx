import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	change: 'Replace Image'
};

const t = scoped('course-figure-controls', DEFAULT_TEXT);

export default class BlockTypeControls extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		onRemove: PropTypes.func,
		onChange: PropTypes.func
	}


	onRemove = () => {
		const {onRemove} = this.props;

		if (onRemove) {
			onRemove();
		}
	}


	onChange = () => {
		const {onChange} = this.props;

		if (onChange) {
			onChange();
		}
	}


	render () {
		const {className} = this.props;
		const cls = cx('custom-block-type-control', className);

		return (
			<div className={cls}>
				<div className="spacer" />
				<div className="change" onClick={this.onChange}>
					<i className="icon-image" />
					<span>{t('change')}</span>
				</div>
				<div className="remove" onClick={this.onRemove}>
					<i className="icon-bold-x" />
				</div>
			</div>
		);
	}
}
