import React from 'react';
import cx from 'classnames';
import {FixedElement} from 'nti-web-commons';


PanelSidebar.propTypes = {
	className: React.PropTypes.string,
	sidebar: React.PropTypes.node,
	children: React.PropTypes.any
};
export default function PanelSidebar ({className, sidebar, children}) {
	const cls = cx('panel-sidebar', className);

	return (
		<div className={cls}>
			<div className="panel">
				{children}
			</div>
			<div className="sidebar">
				<FixedElement>
					{sidebar}
				</FixedElement>
			</div>
		</div>
	);

}
