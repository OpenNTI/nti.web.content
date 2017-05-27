import PropTypes from 'prop-types';
import React from 'react';

export default class BreadcrumbItem extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}


	onClick = () => {
		const {item} = this.props;

		if (item && item.handleRoute) {
			item.handleRoute();
		}
	}

	render () {
		const {item} = this.props;
		const {label} = item;

		return (
			<span className="content-editor-breadcrumb-item" onClick={this.onClick}>
				{label}
			</span>
		);
	}
}
