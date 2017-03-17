import React from 'react';
import {Pager} from 'nti-web-commons';

import Breadcrumb from './Breadcrumb';

NavBar.propTypes = {
	gotoRoot: React.PropTypes.func,
	pageSource: React.PropTypes.object,
	breadcrumb: React.PropTypes.array,
	gotoResources: React.PropTypes.func
};
export default function NavBar ({pageSource, gotoResources, breadcrumb}) {
	return (
		<div className="editor-nav-bar">
			<Breadcrumb gotoResources={gotoResources} breadcrumb={breadcrumb} />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}
