/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import {getService} from '@nti/web-client';

import {Stream} from '../../../src';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

export default class Test extends React.Component {

	state = {}

	static childContextTypes = {
		router: PropTypes.object
	}

	componentDidMount () {
		this.setup();
	}

	getChildContext () {
		return {
			router: {
				baseroute: '/',
				route: {
					location: {
						pathname: '/lti'
					}
				},
				getRouteFor: () => {
					return {
						href: '/foo',
						download: true
					};
				},
				history: {
					push: () => {},
					replace: () => {},
					createHref: () => {}
				}
			}
		};
	}

	async setup () {
		const service = await getService();
		const context = await service.getObject('tag:nextthought.com,2011-10:IFSTA-Bundle-IFSTA_Book_Aircraft_Rescue_and_Fire_Fighting_Sixth_Edition');

		this.setState({ context });
	}

	render () {
		const {context} = this.state;

		return (
			<div className="test-container">
				{context && <Stream context={context} />}
			</div>
		);
	}
}
