/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {getService} from '@nti/web-client';

// import {Flyout} from '../../src/table-of-contents/';
import {Stream} from '../../src';
// // import RSTTest from '../../src/RST/test';

// import 'normalize.css';
import '@nti/style-common/fonts.scss';
import '@nti/style-common/all.scss';
import '@nti/web-commons/lib/index.css';
import '@nti/web-video/lib/index.css';
import '@nti/web-editor/lib/index.css';
import './index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Test extends React.Component {

	state = {}

	componentDidMount () {
		this.setup();
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

ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
