import React from 'react';
import { mount } from 'enzyme';

import ContentNavMenu from '../ContentNavMenu';

/* eslint-env jest */
describe('ContentNavMenu test', () => {
	const activeContent = {
		title: 'Active Content',
		thumb: '/active/url',
		subItems: [
			{
				title: 'Section 1'
			},
			{
				title: 'Section 2',
				cls: 'current'
			}
		]
	};

	const recentContentItems = [
		{
			title: 'Content 1',
			thumb: '/some/url1'
		},
		{
			title: 'Content 1',
			thumb: '/some/url2'
		}
	];

	const verifyContents = (cmp) => {
		const activeContentEl = cmp.find('.active-content').first();

		const activeTitle = activeContentEl.find('.title').first();

		expect(activeContentEl.find('img').prop('src')).toEqual('/active/url');

		expect(activeTitle.text()).toEqual('Active Content');

		const sections = cmp.find('.sections-list').first().find('.section');

		expect(sections.at(0).text()).toEqual('Section 1');
		expect(sections.at(0).prop('className')).not.toMatch(/current/);

		expect(sections.at(1).text()).toEqual('Section 2');
		expect(sections.at(1).prop('className')).toMatch(/current/);

		const recentContentItemsList = cmp.find('.recent-content-items-list').first().find('.recent-content');

		expect(recentContentItemsList.at(0).find('img').first().prop('src')).toEqual('/some/url1');
		expect(recentContentItemsList.at(1).find('img').first().prop('src')).toEqual('/some/url2');
	};

	test('Test non-admin', () => {
		const cmp = mount(
			<ContentNavMenu
				activeContent={activeContent}
				recentContentItems={recentContentItems}
				type={ContentNavMenu.COURSE}/>
		);

		verifyContents(cmp);

		expect(cmp.find('.delete-content').exists()).toBe(false);
		expect(cmp.find('.edit').exists()).toBe(false);
		expect(cmp.find('.publish').exists()).toBe(false);
	});

	test('Test admin', () => {
		const onItemClick = jest.fn();
		const onEdit = jest.fn();
		const onDelete = jest.fn();
		const onPublish = jest.fn();

		const cmp = mount(
			<ContentNavMenu
				activeContent={activeContent}
				recentContentItems={recentContentItems}
				onItemClick={onItemClick}
				onEdit={onEdit}
				onDelete={onDelete}
				onPublish={onPublish}
				type={ContentNavMenu.COURSE}
				isAdministrator/>
		);

		verifyContents(cmp);

		expect(cmp.find('.delete-content').exists()).toBe(true);

		const edit = cmp.find('.edit').first();
		edit.simulate('click');
		expect(onEdit).toHaveBeenCalled();

		const publish = cmp.find('.publish').first();
		publish.simulate('click');
		expect(onPublish).toHaveBeenCalled();

		const deleteBtn = cmp.find('.delete-content').first();
		deleteBtn.simulate('click');
		expect(onDelete).toHaveBeenCalled();

		const recentContent1 = cmp.find('.recent-content').first();

		recentContent1.simulate('click');

		expect(onItemClick).toHaveBeenCalled();
	});
});
