import React from 'react';
import {Pager} from 'nti-web-commons';

import Breadcrumb from './Breadcrumb';

NavBar.propTypes = {
	gotoRoot: React.PropTypes.func,
	pageSource: React.PropTypes.object,
	gotoResources: React.PropTypes.func
};
export default function NavBar ({pageSource, gotoResources}) {
	return (
		<div className="editor-nav-bar">
			<Breadcrumb gotoResources={gotoResources} />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}
