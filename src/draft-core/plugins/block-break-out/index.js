import {BLOCKS} from '../../Constants';

import {HANDLED, NOT_HANDLED} from '../Constants';

const DEFAULT_BREAK_TO = {
	[BLOCKS.HEADER_ONE]: BLOCKS.UNSTYLED,
	[BLOCKS.HEADER_TWO]: BLOCKS.UNSTYLED,
	[BLOCKS.HEADER_THREE]: BLOCKS.UNSTYLED,
	[BLOCKS.HEADER_FOUR]: BLOCKS.UNSTYLED,
	[BLOCKS.HEADER_FIVE]: BLOCKS.UNSTYLED,
	[BLOCKS.HEADER_SIX]: BLOCKS.HEADER_SIX
};

const DEFAULT_CONVERT_IF_EMPTY = {
	[BLOCKS.ORDERED_LIST_ITEM]: BLOCKS.UNSTYLED,
	[BLOCKS.UNORDERED_LIST_ITEM]: BLOCKS.UNSTYLED
};

/**
 * Return a plugin to break out of block types to
 * be more consistent with user expectations of rich
 * text editors.
 *
 * @param  {Object} config define the behavior
 * @param {Object} config.breakTo a map of type to type to convert the new block to on enter
 * @param {Object} config.convertIfEmpty a map of types to convert the current type to if its empty on enter
 * @return {Object}        the config
 */
export default (config = {breakTo: DEFAULT_BREAK_TO, convertIfEmpty: DEFAULT_CONVERT_IF_EMPTY}) => {
	const {breakTo, convertIfEmpty} = config;

	return {


	};
};
