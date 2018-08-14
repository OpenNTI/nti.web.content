import React from 'react';
import PropTypes from 'prop-types';
import { Stream, Select } from '@nti/web-commons';

const SORT = {
	CREATED_TIME: 'CreatedTime',
	RECENT_ACTIVITY: 'LastModified',
	MOST_COMMENTED: 'ReferencedByCount',
	MOST_LIKED: 'RecursiveLikeCount'
};

const { DATE_FILTER_VALUES } = Stream;
const dateOptions = [
	{ label: 'Anytime', value: DATE_FILTER_VALUES.ANYTIME },
	{ label: 'Past Week', value: DATE_FILTER_VALUES.PAST_WEEK },
	{ label: 'Past Month', value: DATE_FILTER_VALUES.PAST_MONTH },
	{ label: 'Past 3 Months', value: DATE_FILTER_VALUES.PAST_THREE_MONTHS },
	{ label: 'Past Year', value: DATE_FILTER_VALUES.PAST_YEAR }
];

const typeOptions = [
	{ label: 'Notes', value: 'notes' },
	{ label: 'Bookmarks', value: 'bookmarks' },
	{ label: 'Highlights', value: 'highlights' },
	{ label: 'Likes', value: 'likes' }
];

const sortByOptions = [
	{ label: 'Date Created', value: 'CreatedTime' },
	{ value: 'LastModified', label: 'Recent Activity' },
	{ value: 'ReferencedByCount', label: 'Most Commented' },
	{ value: 'RecursiveLikeCount', label: 'Most Liked' }
];

import Store from '../Store';

@Store.connect({
	setBatchAfter: 'setBatchAfter'
})
class Sidebar extends React.Component {
	static propTypes = {
		setBatchAfter: PropTypes.func.isRequired
	}

	state = {
		accepts: [],
		batchAfter: DATE_FILTER_VALUES.ANYTIME,
		sort: SORT.CREATED_TIME
	};

	onDateChange = option => {
		this.setState({ batchAfter: option.value });
		this.props.setBatchAfter(option.value);
	};

	onTypeChange = (option, selected) => {
		if (selected) {
			this.setState({
				typeFilters: [...this.state.typeFilters, option.value]
			});
		} else {
			const newFilters = this.state.typeFilters.slice();
			const index = this.state.typeFilters.indexOf(option.value);
			newFilters.splice(index, 1);
			this.setState({ accepts: newFilters });
		}
	};

	onSortByChange = ({ target: { value } }) => {
		this.setState({ sort: value });
	};

	render() {
		const { accepts, batchAfter, sort } = this.state;

		return (
			<Stream.FilterSidebar>
				<div className="select-title">SORT BY</div>
				<Select
					className="stream-sidebar-sort"
					value={sort}
					onChange={this.onSortByChange}
				>
					{sortByOptions.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</Select>
				<Stream.DateRange
					value={batchAfter}
					onChange={this.onDateChange}
					options={dateOptions}
				/>
				<Stream.TypeFilter
					title="ACTIVITY TYPE"
					values={accepts}
					onChange={this.onTypeChange}
					options={typeOptions}
				/>
			</Stream.FilterSidebar>
		);
	}
}

export default Sidebar;
