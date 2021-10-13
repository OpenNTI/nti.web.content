import './View.scss';
import PropTypes from 'prop-types';

import { Pager } from '@nti/web-commons';

import Breadcrumb from './Breadcrumb';

NavBar.propTypes = {
	gotoRoot: PropTypes.func,
	pageSource: PropTypes.object,
	breadcrumb: PropTypes.array,
	gotoResources: PropTypes.func,
};
export default function NavBar({ pageSource, gotoResources, breadcrumb }) {
	return (
		<div className="editor-nav-bar">
			<Breadcrumb gotoResources={gotoResources} breadcrumb={breadcrumb} />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}
