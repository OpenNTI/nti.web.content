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
	{ label: 'Highlights', value: 'HIGHLIGHTS' }
];

const sortByOptions = [
	{ label: 'Date Created', value: 'CreatedTime' },
	{ value: 'LastModified', label: 'Recent Activity' },
	{ value: 'ReferencedByCount', label: 'Most Commented' },
	{ value: 'RecursiveLikeCount', label: 'Most Liked' }
];


class Sidebar extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		types: PropTypes.object,
		sortOn: PropTypes.string,
		batchAfter: PropTypes.string
	};

	onDateChange = option => {
		this.props.onChange({ ...this.props, batchAfter: option.value });
	};

	onTypeChange = (option, selected) => {
		this.props.onChange({
			...this.props,
			types: {
				...this.props.types,
				[option.value]: selected
			}
		});
	};

	onSortByChange = ({ target: { value } }) => {
		this.props.onChange({ ...this.props, sortOn: value });
	};

	render () {
		const { batchAfter, sortOn, types } = this.props;

		return (
			<Stream.FilterSidebar>
				<div className="select-title">SORT BY</div>
				<Select
					className="stream-sidebar-sort"
					value={sortOn}
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
					values={Object.keys(types).filter(x => types[x])}
					onChange={this.onTypeChange}
					options={typeOptions}
				/>
			</Stream.FilterSidebar>
		);
	}
}

export default Sidebar;
