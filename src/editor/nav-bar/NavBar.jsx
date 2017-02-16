import React from 'react';
import {Pager} from 'nti-web-commons';

import Breadcrumb from './Breadcrumb';

NavBar.propTypes = {
	gotoRoot: React.PropTypes.func,
	pageSource: React.PropTypes.object
}
export default function NavBar ({pageSource}) {
	return (
		<div className="editor-nav-bar">
			<Breadcrumb />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}
