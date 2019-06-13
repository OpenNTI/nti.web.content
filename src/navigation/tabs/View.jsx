import React from 'react';
import PropTypes from 'prop-types';

import Store from './Store';

export default
@Store.connect(['tabConfigs'])
class ContentTabs extends React.Component {
	static deriveBindingFromProps (props) {
		return {
			content: props.content,
			activeRoute: props.activeRoute,
			baseRoute: props.baseRoute,
			getRouteFor: props.getRouteFor,
			tabs: props.tabs
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
				getPathToRemember: PropTypes.func
			})
		)
	}
}
