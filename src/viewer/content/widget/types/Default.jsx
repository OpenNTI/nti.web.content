import React from 'react';
import PropTypes from 'prop-types';

DefaultViewerWidget.propTypes = {
	part: PropTypes.object
};
export default function DefaultViewerWidget ({part}) {
	return (
		<div>Unknown Widget Type {JSON.stringify(part)}</div>
	);
}
