import React from 'react';
import PropTypes from 'prop-types';
import {Search} from 'nti-web-commons';

import Tree from './Tree';

export default class TableOfContents extends React.Component {
	static propTypes = {
		toc: PropTypes.object.isRequired,
		doNavigation: PropTypes.func
	}

	state = {}

	updateFilter = (filter) => {
		this.setState({filter});
	}

	render () {
		const {toc, doNavigation} = this.props;
		const {filter} = this.state;

		return (
			<div className="table-of-contents">
				<div className="header">
					<Search onChange={this.updateFilter} />
				</div>
				<Tree node={toc.root} filter={filter} doNavigation={doNavigation} />
			</div>
		);
	}
}
