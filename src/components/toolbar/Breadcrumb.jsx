import './Breadcrumb.scss';
import React from 'react';
import PropTypes from 'prop-types';

import BreadcrumbItem from './BreadcrumbItem';

export default class Breadcrumb extends React.Component {
	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.object),
		message: PropTypes.object,
		onClick: PropTypes.func
	}

	constructor (props) {
		super(props);
	}

	renderBreadcrumbPart = (part, index, arr) => (
		<BreadcrumbItem
			onClick={this.props.onClick}
			isRoot={index === 0}
			isCurrent={index === arr.length - 1}
			item={part}
			key={index}
			bcKey={index}
			message={index === arr.length - 1 ? this.props.message : null}/>
	);


	render () {
		return (
			<div className="breadcrumb">
				{(this.props.items || []).map(this.renderBreadcrumbPart)}
			</div>
		);
	}
}
