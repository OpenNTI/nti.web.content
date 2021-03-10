import './PanelSidebar.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { FixedElement } from '@nti/web-commons';
import Logger from '@nti/util-logger';

const logger = Logger.get('lib:content-editor:PanelSidebar');

export default class PanelSidebar extends React.Component {
	componentDidCatch(error, info) {
		logger.error(error);
		this.setState({ error });
	}

	render() {
		const { className, sidebar, children } = this.props;
		const cls = cx('panel-sidebar', className);

		return (
			<div className={cls}>
				<div className="panel">{children}</div>
				<div className="sidebar">
					<FixedElement>{sidebar}</FixedElement>
				</div>
			</div>
		);
	}
}

PanelSidebar.propTypes = {
	className: PropTypes.string,
	sidebar: PropTypes.node,
	children: PropTypes.any,
};
