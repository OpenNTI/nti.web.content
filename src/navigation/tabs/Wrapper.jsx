import URL from 'url';

import React from 'react';
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

export default class ContentTabsWrapper extends React.Component {
	static propTypes = {
		activeRoute: PropTypes.string,
		baseRoute: PropTypes.string
	}

	static contextTypes = {
		router: PropTypes.object
	}


	get router () {
		return this.context.router;
	}


	get baseRoute () {
		if (!this.router) {
			return '';
		}

		return this.router.baseroute;
	}


	get activeRoute () {
		if (!this.router || !this.router.route || !this.router.route.location) {
			return '';
		}

		return getRouteFromLocation(this.router.route.location);
	}


	get getRouteFor () {
		return this.router && this.router.getRouteFor;
	}


	render () {
		const {activeRoute, baseRoute, ...otherProps} = this.props;

		return (
			<View
				{...otherProps}
				activeRoute={activeRoute || this.activeRoute}
				baseRoute={baseRoute || this.baseRoute}
				getRouteFor={this.getRouteFor}
			/>
		);
	}
}