import React from 'react';
import cx from 'classnames';
import {INLINE_STYLE} from 'draft-js-utils';

const clone = x => typeof x === 'string' ? x : React.cloneElement(x);
const stop = e => (e.preventDefault(), e.stopPropagation());

export const Formats = Object.freeze({
	CODE: INLINE_STYLE.CODE,
	BOLD: INLINE_STYLE.BOLD,
	ITALIC: INLINE_STYLE.ITALIC,
	UNDERLINE: INLINE_STYLE.UNDERLINE
});

export default class FormatButton extends React.Component {
	static Formats = Formats

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			toggleInlineStyle: React.PropTypes.func.isRequired,
			currentInlineStyles: React.PropTypes.object,
			allowedInlineStyles: React.PropTypes.array
		})
	}

	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		format: React.PropTypes.oneOf(Object.keys(Formats)).isRequired
	}

	get isAllowed () {
		const {format} = this.props;
		const {context: {allowedInlineStyles}} = this;

		return allowedInlineStyles && allowedInlineStyles.has(format);
	}


	get isCurrent () {
		const {format} = this.props;
		const {context: {currentInlineStyles}} = this;

		return currentInlineStyles && currentInlineStyles.has(format);
	}


	onMouseDown = () => {

	}

	onClick = (e) => {
		stop(e);
	}


	render () {
		const {format = '_'} = this.props;
		const {isAllowed, isCurrent} = this;
		const cls = cx('format-button', {active: isCurrent, disabled: !isAllowed});
		const label = (format || '').toLowerCase();

		return (
			<button
				className={cls}
				onMouseDown={this.onMouseDown}//onCLisk is to late
				onClick={this.onClick}
				data-format={label}
				aria-label={label}
			>
				{this.renderLabel(format)}
			</button>
		);
	}


	renderLabel (format) {
		const {children} = this.props;

		if (React.Children.count(children) > 0) {
			return React.Children.map(children, x => clone(x));
		}

		return (
			<i className={`icon-${format.toLowerCase()}`} />
		);
	}
}
