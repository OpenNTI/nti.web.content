/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {decodeFromURI} from 'nti-lib-ntiids';
import {getService} from 'nti-web-client';
import {ConflictResolutionHandler} from 'nti-web-commons';

import {Editor} from '../../src';
// import RSTTest from '../../src/RST/test';

import 'normalize.css';
import 'nti-style-common/fonts.scss';
import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-web-video/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};


//Test: Content package: tag:nextthought.com,2011-10:NTI-HTML-system_4744023779772891797_C92F81A2

let contentPackageID = localStorage.getItem('content-package-ntiid');

if (!contentPackageID) {
	contentPackageID = decodeFromURI(window.prompt('Enter Content Package NTIID'));
	localStorage.setItem('content-package-ntiid', contentPackageID);
}

let courseID = localStorage.getItem('course-ntiid');

if (!courseID) {
	courseID = decodeFromURI(window.prompt('Enter Course NTIID'));
	localStorage.setItem('course-ntiid', courseID);
}

function resolveObjects () {
	return getService()
		.then((service) => {
			return service.getObject(courseID);
		})
		.then((course) => {
			const content = course.getPackage(contentPackageID);

			return {content, course};
		});
}


class Test extends React.Component {

	state = {}

	attachEditor1Ref = e => this.editor1 = e;
	attachEditor2Ref = e => this.editor2 = e;
	logValue = ()=> console.debug(this.focused.getValue())
	logState = ()=> this.focused.logState()
	// focusError = () => error.focus()
	focusToEnd = () => this.editor1.focusToEnd()

	onFocus = (editor) => {
		this.setState({editor});
		this.focused = editor;
	}


	componentDidMount () {
		resolveObjects()
			.then((objects) => {
				this.setState(objects);
			});
	}

	render () {
		const {content, course} = this.state;

		return (
			<div>
				<ConflictResolutionHandler />
				<Editor contentPackage={content} course={course} />
			</div>
		);
	}
}


ReactDOM.render(
	<Test/>,
	document.getElementById('content')
);
