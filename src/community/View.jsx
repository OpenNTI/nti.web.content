import React from 'react';
import PropTypes from 'prop-types';
import { Community } from '@nti/web-profiles';

ContentCommunity.propTypes = {
	content: PropTypes.shape({
		hasCommunity: PropTypes.func.isRequired,
		getCommunity: PropTypes.func.isRequired,
	}).isRequired,
};
export default function ContentCommunity({ content, ...otherProps }) {
	if (!content.hasCommunity) {
		return null;
	} //TODO: show a not found message

	return (
		<Community.View
			community={content.getCommunity()}
			{...otherProps}
			noBackground
		/>
	);
}
