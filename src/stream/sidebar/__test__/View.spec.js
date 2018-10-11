import React from 'react';
import renderer from 'react-test-renderer';

import Sidebar from '../View';

/* eslint-env jest */
describe('Stream: Sidebar', () => {
	test('General Snapshot', () => {
		const tree = renderer.create(
			<Sidebar
				onChange={() => {}}
				params={{
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
				}}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
