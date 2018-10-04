import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FilterSidebar from '../FilterSidebar';

class Sidebar extends React.Component {
	state = {
		params: {
			types: {
				'NOTES': true,
				'BOOKMARKS': true,
				'HIGHLIGHTS': true,
				'THOUGHTS': true,
				'LIKES': true
			},
			batchAfter: null,
			sortOn: 'CreatedTime',
			sortOrder: 'descending'
		}
	}

	onDateChange = option => {
		this.setState({ ...this.state.params, batchAfter: option.value });
	};

	onTypeChange = (option, selected) => {
		this.setState({
			...this.state.params,
			types: {
				...this.state.params.types,
				[option.value]: selected
			}
		});
	};

	onSortByChange = ({ target: { value } }) => {
		this.setState({ ...this.state.params, sortOn: value });
	};

	render () {
		return (
			<FilterSidebar
				params={this.state.params}
				onDateChange={this.onDateChange}
				onTypeChange={this.onTypeChange}
				onSortByChange={this.onSortByChange}
			/>
		);
	}
}

/* eslint-env jest */
describe('FilterSidebar', () => {
	test('Simple case', () => {
		const filterBar = renderer.create(
			<FilterSidebar
				onSortByChange = {() => {}}
				onDateChange = {() => {}}
				onTypeChange = {() => {}}
				params={{
					'types': {
						'NOTES': true,
						'BOOKMARKS': true,
						'HIGHLIGHTS': true,
						'THOUGHTS': true,
						'LIKES': true
					},
					'batchAfter': null,
					'sortOn': 'CreatedTime',
					'sortOrder': 'descending'
				}}
			/>
		);
		const tree = filterBar.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Selecting New Options', () => {
		const cmp = mount(<Sidebar />);

		const threeMonths = cmp.find('.option.date-filter').at(3);
		threeMonths.simulate('click');
		cmp.update();
		expect(cmp.state('batchAfter')).toBe('pastthreemonths');

		const highlights = cmp.find('.option.type-filter.selected').at(2);
		highlights.find('input').simulate('change', { target: { checked: false } });
		cmp.update();
		expect(cmp.state('types').HIGHLIGHTS).toBe(false);

		const sortby = cmp.find('.nti-select-native.stream-sidebar-sort');
		sortby.simulate('change', { target: { value: 'LikeCount' } });
		cmp.update();
		expect(cmp.state('sortOn')).toBe('LikeCount');
	});

	test('Override Activity Type', () => {
		const typeOptions = [
			{ label: 'Thoughts', value: 'THOUGHTS' },
			{ label: 'Discussions', value: 'DISCUSSIONS' },
			{ label: 'Notes', value: 'NOTES' },
			{ label: 'Chat', value: 'CHAT' }
		];
		const cmp = renderer.create(
			<FilterSidebar
				typeOptions={typeOptions}
				onSortByChange={() => { }}
				onDateChange={() => { }}
				onTypeChange={() => { }}
				params={{
					'types': {
						'NOTES': true,
						'DISCUSSIONS': true,
						'THOUGHTS': true,
						'CHAT': true,
					},
					'batchAfter': null,
					'sortOn': 'CreatedTime',
					'sortOrder': 'descending'
				}}
			/>
		);
		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Override Sort By Options', () => {
		const sortByOptions = [
			{ label: 'Date Created', value: 'CreatedTime' },
			{ value: 'FirstModified', label: 'Last Activity' },
			{ value: 'ReferencedByLeast', label: 'Least Commented' },
			{ value: 'CountLike', label: 'Liked Most' }
		];
		const cmp = renderer.create(
			<FilterSidebar
				sortByOptions={sortByOptions}
				onSortByChange={() => { }}
				onDateChange={() => { }}
				onTypeChange={() => { }}
				params={{
					'types': {
						'NOTES': true,
						'DISCUSSIONS': true,
						'THOUGHTS': true,
						'CHAT': true,
					},
					'batchAfter': null,
					'sortOn': 'CreatedTime',
					'sortOrder': 'descending'
				}}
			/>
		);
		const tree = cmp.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
