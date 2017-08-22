import React from 'react';
import PropTypes from 'prop-types';

import BreadcrumbItem from './BreadcrumbItem';

export default class Breadcrumb extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object),
		onClick: PropTypes.func
	}

	constructor (props) {
		super(props);
	}

	renderBreadcrumbPart = (part, index, arr) => {
		return (
			<BreadcrumbItem
				onClick={this.props.onClick}
				current={index === arr.length}
				item={part}
				key={index}
				bcKey={index}/>);
	}

	render () {
		return (
			<div className="breadcrumb">
				{(this.props.items || []).map(this.renderBreadcrumbPart)}
			</div>
		);
	}
}
