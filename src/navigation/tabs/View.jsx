import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { Navigation } from '@nti/web-commons';

import Store from './Store';

class ContentTabs extends React.Component {
	static deriveBindingFromProps(props) {
		return {
			content: props.content,
			activeRoute: props.activeRoute,
			baseRoute: props.baseRoute,
			getRouteFor: props.getRouteFor,
			tabs: props.tabs,
		};
	}

	static propTypes = {
		content: PropTypes.object.isRequired,
		activeRoute: PropTypes.string,
		baseRoute: PropTypes.string,
		getRouteFor: PropTypes.func,
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				id: PropTypes.string,
				aliases: PropTypes.arrayOf(PropTypes.string),
				getPathToRemember: PropTypes.func,
				shouldShowFor: PropTypes.func,
				isRoot: PropTypes.bool,
			})
		),
		expandTabs: PropTypes.bool,

		tabConfigs: PropTypes.array,
	};

	render() {
		const { tabConfigs, expandTabs } = this.props;

		if (!tabConfigs || !tabConfigs.length) {
			return null;
		}

		return (
			<Navigation.Tabs expandTabs={expandTabs}>
				{tabConfigs.map(tab => this.renderTab(tab))}
			</Navigation.Tabs>
		);
	}

	renderTab(tab) {
		const { id, label, route, active } = tab;

		return (
			<Navigation.Tabs.Tab
				key={id}
				route={route}
				label={label}
				active={active}
			/>
		);
	}
}

export default decorate(ContentTabs, [Store.connect(['tabConfigs'])]);
