/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Test from './stream';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
