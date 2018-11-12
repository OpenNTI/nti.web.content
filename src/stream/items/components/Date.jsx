import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from '@nti/web-commons';

export default function Date ({ date, format }) {
	return (
		<time className="stream-item-date">{DateTime.format(date, format || 'MMMM D, YYYY')}</time>
	);
}

Date.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	format: PropTypes.string
};
