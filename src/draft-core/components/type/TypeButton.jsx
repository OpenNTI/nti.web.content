import React from 'react';
import cx from 'classnames';
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

export default class TypeButton extends React.Component {
	static Types = Types

	static contextTypes = {
		editorContext: React.PropTypes.shape({
			toggleBlockType: React.PropTypes.func.isRequired,
			currentBlockType: React.PropTypes.string,
			allowedBlockTypes: React.PropTypes.object
		})
	}

	static propTypes = {
		className: React.PropTypes.string,
		type: React.PropTypes.oneOf(Object.values(Types)).isRequired,
		label: React.PropTypes.string
	}

	get isAllowed () {
		const {type} = this.props;
		const {editorContext: {allowedBlockTypes}} = this.context;

		return allowedBlockTypes && allowedBlockTypes.has(type);
	}

	get isCurrent () {
		const {type} = this.props;
		const {editorContext: {currentBlockType}} = this.context;

		return type === currentBlockType;
	}


	onMouseDown = (e) => {
		const {type} = this.props;
		const {editorContext: {toggleBlockType}} = this.context;

		if (e) {
			e.preventDefault();
		}

		if (toggleBlockType) {
			toggleBlockType(type);
		}
	}


	render () {
		const {type = '_', className} = this.props;
		const {isAllowed, isCurrent} = this;
		const cls = cx('draft-core-type-button', className, {active: isCurrent, disabled: !isAllowed});

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
		const {label} = this.props;

		return (
			<span>{label || type}</span>
		);
	}
}
