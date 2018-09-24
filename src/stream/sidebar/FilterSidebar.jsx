import React from 'react';
import PropTypes from 'prop-types';
import { Stream, Select } from '@nti/web-commons';

const { DATE_FILTER_VALUES } = Stream;
const dateOptions = [
	{ label: 'Anytime', value: DATE_FILTER_VALUES.ANYTIME },
	{ label: 'Past Week', value: DATE_FILTER_VALUES.PAST_WEEK },
	{ label: 'Past Month', value: DATE_FILTER_VALUES.PAST_MONTH },
	{ label: 'Past 3 Months', value: DATE_FILTER_VALUES.PAST_THREE_MONTHS },
	{ label: 'Past Year', value: DATE_FILTER_VALUES.PAST_YEAR }
];
const typeOptions = [
	{ label: 'Notes', value: 'NOTES' },
	{ label: 'Bookmarks', value: 'BOOKMARKS' },
	{ label: 'Highlights', value: 'HIGHLIGHTS' },
	{ label: 'Likes', value: 'LIKES' }
];
const sortByOptions = [
	{ label: 'Date Created', value: 'CreatedTime' },
	{ value: 'LastModified', label: 'Recent Activity' },
	{ value: 'ReferencedByCount', label: 'Most Commented' },
	{ value: 'LikeCount', label: 'Most Liked' }
];

class FilterSidebar extends React.Component {
	static propTypes = {
		onSortByChange: PropTypes.func.isRequired,
		onDateChange: PropTypes.func.isRequired,
		onTypeChange: PropTypes.func.isRequired,
		params: PropTypes.shape({
			types: PropTypes.object,
			sortOn: PropTypes.string,
			batchAfter: PropTypes.string
		})
	}

	render () {
		const { params: { batchAfter, sortOn, types }, onSortByChange, onDateChange, onTypeChange } = this.props;

		return (
			<Stream.FilterSidebar>
				<div className="select-title">SORT BY</div>
				<Select
					className="stream-sidebar-sort"
					value={sortOn}
					onChange={onSortByChange}
				>
					{sortByOptions.map(({ value, label }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</Select>
				<Stream.DateRange
					value={batchAfter}
					onChange={onDateChange}
					options={dateOptions}
				/>
				<Stream.TypeFilter
					title="ACTIVITY TYPE"
					values={Object.keys(types).filter(x => types[x])}
					onChange={onTypeChange}
					options={typeOptions}
				/>
			</Stream.FilterSidebar>
		);
	}
}

export default FilterSidebar;
