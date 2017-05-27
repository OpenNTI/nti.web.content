import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {BLOCK_TYPE} from 'draft-js-utils';

const stop = e => (e.preventDefault(), e.stopPropagation());

export const Types = Object.freeze({
	ATOMIC: BLOCK_TYPE.ATOMIC,
	BLOCKQUOTE: BLOCK_TYPE.BLOCKQUOTE,
	CODE: BLOCK_TYPE.CODE,
	HEADER_FIVE: BLOCK_TYPE.HEADER_FIVE,
	HEADER_FOUR: BLOCK_TYPE.HEADER_FOUR,
	HEADER_ONE: BLOCK_TYPE.HEADER_ONE,
	HEADER_SIX: BLOCK_TYPE.HEADER_SIX,
	HEADER_THREE: BLOCK_TYPE.HEADER_THREE,
	HEADER_TWO: BLOCK_TYPE.HEADER_TWO,
	ORDERED_LIST_ITEM: BLOCK_TYPE.ORDERED_LIST_ITEM,
	PULLQUOTE: BLOCK_TYPE.PULLQUOTE,
	UNORDERED_LIST_ITEM: BLOCK_TYPE.UNORDERED_LIST_ITEM,
	UNSTYLED: BLOCK_TYPE.UNSTYLED
});

const t = scoped('DRAFT_CORE_TYPE_BUTTON', Types);

export default class TypeButton extends React.Component {
	static Types = Types

	static contextTypes = {
		editorContext: PropTypes.shape({
			plugins: PropTypes.shape({
				toggleBlockType: PropTypes.func.isRequired,
				currentBlockType: PropTypes.string,
				allowedBlockTypes: PropTypes.object
			})
		})
	}

	static propTypes = {
		className: PropTypes.string,
		type: PropTypes.oneOf(Object.values(Types)).isRequired,
		label: PropTypes.string,
		children: PropTypes.node,
		getString: PropTypes.func,
		plain: PropTypes.bool,
		checkmark: PropTypes.bool
	}

	get editorContext () {
		return this.context.editorContext || {};
	}


	get pluginContext () {
		return this.editorContext.plugins || {};
	}


	get getString () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}

	get isAllowed () {
		const {type} = this.props;
		const {allowedBlockTypes} = this.pluginContext;

		return allowedBlockTypes && allowedBlockTypes.has(type);
	}

	get isCurrent () {
		const {type} = this.props;
		const {currentBlockType} = this.pluginContext;

		return type === currentBlockType;
	}


	onMouseDown = (e) => {
		const {type} = this.props;
		const {toggleBlockType} = this.pluginContext;

		if (e) {
			e.preventDefault();
		}

		if (toggleBlockType) {
			toggleBlockType(type);
		}
	}


	render () {
		const {type = '_', className, plain, checkmark} = this.props;
		const {isAllowed, isCurrent} = this;
		const cls = cx('draft-core-type-button', className, type, {active: isCurrent, disabled: !isAllowed, plain, checkmark});

		return (
			<button
				className={cls}
				onMouseDown={this.onMouseDown}
				onClick={stop}
				data-type={type}
				aria-label={type}
			>
				{this.renderLabel(type)}
			</button>
		);
	}


	renderLabel = (type) => {
		const {label, children} = this.props;
		const child = children && React.Children.only(children);

		if (child) {
			return child;
		}

		return (
			<span>{label || this.getString(type)}</span>
		);
	}
}
