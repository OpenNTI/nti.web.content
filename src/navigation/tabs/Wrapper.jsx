import URL from 'url';


import React from 'react';
import {useLocation} from '@nti/web-routing';
import PropTypes from 'prop-types';

import View from './View';

function getRouteFromLocation (location) {
	const {hash, pathname, search} = location;
	return URL.format({
		pathname,
		hash,
		search
	});
}

ContentTabsWrapper.propTypes = {
	activeRoute: PropTypes.string,
	baseRoute: PropTypes.string
};

ContentTabsWrapper.contextTypes = {
	router: PropTypes.shape({
		baseroute: PropTypes.string,
		getRouteFor: PropTypes.func,
	}).isRequired
};


export default function ContentTabsWrapper ({activeRoute, baseRoute, ...otherProps}, {router}) {
	const location = useLocation();

	return (
		<View
			{...otherProps}
			activeRoute={activeRoute || getRouteFromLocation(location)}
			baseRoute={baseRoute || router.baseroute}
			getRouteFor={router.getRouteFor}
		/>
	);

}
