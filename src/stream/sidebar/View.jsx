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
	{ label: 'Notes', value: 'NOTES' },
	{ label: 'Bookmarks', value: 'BOOKMARKS' },
	{ label: 'Highlights', value: 'HIGHLIGHTS' },
	{ label: 'Likes', value: 'LIKES' }
];

const sortByOptions = [
	{ label: 'Date Created', value: 'CreatedTime' },
	{ value: 'LastModified', label: 'Recent Activity' },
	{ value: 'ReferencedByCount', label: 'Most Commented' },
	{ value: 'RecursiveLikeCount', label: 'Most Liked' }
];

const allTypes = typeOptions.map(x => x.value);

import Store from '../Store';

@Store.connect({
	setBatchAfter: 'setBatchAfter',
	setSortOn: 'setSortOn',
	setExclude: 'setExclude'
})
class Sidebar extends React.Component {
	static propTypes = {
		setBatchAfter: PropTypes.func.isRequired,
		setSortOn: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired,
		setExclude: PropTypes.func.isRequired
	};

	state = {
		excludes: [],
		accepts: allTypes,
		batchAfter: DATE_FILTER_VALUES.ANYTIME,
		sortOn: SORT.CREATED_TIME
	};

	componentDidMount() {
		this.isOpenSearch();
	}

	isOpenSearch() {
		const { excludes, batchAfter, sortOn } = this.state;

		this.props.onChange(
			excludes.length === 0 &&
				batchAfter === DATE_FILTER_VALUES.ANYTIME &&
				sortOn === SORT.CREATED_TIME
		);
	}

	onDateChange = option => {
		this.setState({ batchAfter: option.value }, () => {
			this.isOpenSearch();
		});
		this.props.setBatchAfter(option.value);
	};

	onTypeChange = (option, selected) => {
		const { excludes } = this.state;
		if (selected) {
			const newFilters = excludes.slice();
			const index = excludes.indexOf(option.value);
			newFilters.splice(index, 1);
			this.setState({ excludes: newFilters }, () => {
				this.isOpenSearch();
			});
			this.props.setExclude(newFilters);
		} else {
			this.setState(
				{
					excludes: [...excludes, option.value]
				},
				() => {
					this.isOpenSearch();
				}
			);
			this.props.setExclude([...excludes, option.value]);
		}
	};

	onSortByChange = ({ target: { value } }) => {
		this.setState({ sortOn: value }, () => {
			this.isOpenSearch();
		});
		this.props.setSortOn(value);
	};

	render() {
		const { excludes, batchAfter, sortOn } = this.state;

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
					values={
						excludes.length === 0
							? allTypes
							: allTypes.filter(x => !excludes.includes(x))
					}
					onChange={this.onTypeChange}
					options={typeOptions}
				/>
			</Stream.FilterSidebar>
		);
	}
}

export default Sidebar;
