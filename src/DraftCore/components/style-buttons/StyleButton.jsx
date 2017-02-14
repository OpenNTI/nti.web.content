import React from 'react';
import cx from 'classnames';
import {INLINE_STYLE} from 'draft-js-utils';

const clone = x => typeof x === 'string' ? x : React.cloneElement(x);
const stop = e => (e.preventDefault(), e.stopPropagation());

export const Styles = Object.freeze({
	CODE: INLINE_STYLE.CODE,
	BOLD: INLINE_STYLE.BOLD,
	ITALIC: INLINE_STYLE.ITALIC,
	UNDERLINE: INLINE_STYLE.UNDERLINE
});

export default class StyleButton extends React.Component {
	static Styles = Styles

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			toggleInlineStyle: React.PropTypes.func.isRequired,
			currentInlineStyles: React.PropTypes.object,
			allowedInlineStyles: React.PropTypes.object
		})
	}

	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		style: React.PropTypes.oneOf(Object.keys(Styles)).isRequired
	}

	get isAllowed () {
		const {style} = this.props;
		const {editorContext: {allowedInlineStyles}} = this.context;

		return allowedInlineStyles && allowedInlineStyles.has(style);
	}


	get isCurrent () {
		const {style} = this.props;
		const {editorContext: {currentInlineStyles}} = this.context;

		return currentInlineStyles && currentInlineStyles.has(style);
	}


	onMouseDown = (e) => {
		const {style} = this.props;
		const {editorContext: {toggleInlineStyle}} = this.context;

		if (e) {
			e.preventDefault();
		}

		if (toggleInlineStyle) {
			toggleInlineStyle(style);
		}
	}


	render () {
		const {style = '_', className} = this.props;
		const {isAllowed, isCurrent} = this;
		const cls = cx('draft-core-style-button', className, {active: isCurrent, disabled: !isAllowed});
		const label = (style || '').toLowerCase();

		return (
			<button
				className={cls}
				onMouseDown={this.onMouseDown}//onCLisk is to late
				onClick={stop}
				data-style={label}
				aria-label={label}
			>
				{this.renderLabel(style)}
			</button>
		);
	}


	renderLabel (style) {
		const {children} = this.props;

		if (React.Children.count(children) > 0) {
			return React.Children.map(children, x => clone(x));
		}

		return (
			<i className={`icon-${style.toLowerCase()}`} />
		);
	}
}
