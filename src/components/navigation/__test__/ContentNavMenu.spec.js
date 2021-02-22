import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ContentNavMenu from '../ContentNavMenu';

/* eslint-env jest */
describe('ContentNavMenu test', () => {
	const activeContent = {
		title: 'Active Content',
		thumb: '/active/url',
		subItems: [
			{
				title: 'Section 1',
			},
			{
				title: 'Section 2',
				cls: 'current',
			},
		],
	};

	const recentContentItems = [
		{
			title: 'Content 1',
			thumb: '/some/url1',
		},
		{
			title: 'Content 1',
			thumb: '/some/url2',
		},
	];

	const verifyContents = ({ container: c }) => {
		const activeContentEl = c.querySelector('.active-content');

		const activeTitle = activeContentEl.querySelector('.title');

		expect(
			activeContentEl.querySelector('img').getAttribute('src')
		).toEqual('/active/url');

		expect(activeTitle.textContent).toEqual('Active Content');

		const sections = c.querySelectorAll('.sections-list .section');

		expect(sections[0].textContent).toEqual('Section 1');
		expect(sections[0].getAttribute('class')).not.toMatch(/current/);

		expect(sections[1].textContent).toEqual('Section 2');
		expect(sections[1].getAttribute('class')).toMatch(/current/);

		const recentContentItemsList = c.querySelectorAll(
			'.recent-content-items-list .recent-content'
		);

		expect(
			recentContentItemsList[0].querySelector('img').getAttribute('src')
		).toEqual('/some/url1');
		expect(
			recentContentItemsList[1].querySelector('img').getAttribute('src')
		).toEqual('/some/url2');
	};

	test('Test non-admin', () => {
		const result = render(
			<ContentNavMenu
				activeContent={activeContent}
				recentContentItems={recentContentItems}
				type={ContentNavMenu.COURSE}
			/>
		);

		verifyContents(result);

		expect(result.container.querySelector('.delete-content')).toBeFalsy();
		expect(result.container.querySelector('.edit')).toBeFalsy();
		expect(result.container.querySelector('.publish')).toBeFalsy();
	});

	test('Test admin', () => {
		const onItemClick = jest.fn();
		const onEdit = jest.fn();
		const onDelete = jest.fn();
		const onPublish = jest.fn();

		const result = render(
			<ContentNavMenu
				activeContent={activeContent}
				recentContentItems={recentContentItems}
				onItemClick={onItemClick}
				onEdit={onEdit}
				onDelete={onDelete}
				onPublish={onPublish}
				type={ContentNavMenu.COURSE}
				isAdministrator
				isEditor
			/>
		);

		verifyContents(result);

		expect(result.container.querySelector('.delete-content')).toBeTruthy();

		const edit = result.container.querySelector('.edit');
		fireEvent.click(edit);
		expect(onEdit).toHaveBeenCalled();

		const publish = result.container.querySelector('.publish');
		fireEvent.click(publish);
		expect(onPublish).toHaveBeenCalled();

		const deleteBtn = result.container.querySelector('.delete-content');
		fireEvent.click(deleteBtn);
		expect(onDelete).toHaveBeenCalled();

		const recentContent1 = result.container.querySelector(
			'.recent-content'
		);

		fireEvent.click(recentContent1);

		expect(onItemClick).toHaveBeenCalled();
	});
});
