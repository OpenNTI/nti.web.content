import React from 'react';
import renderer from 'react-test-renderer';
import { TestUtils } from '@nti/web-client';

import Detail from '../Detail';

const { tearDownTestClient, setupTestClient } = TestUtils;

const mockService = {
	resolveEntity: (user) => {
		if (user === 'User') {
			return Promise.resolve({ displayName: 'Tim Jones' });
		} else if (user === 'user2') {
			return Promise.resolve({ displayName: 'Emily Harry' });
		}
	},
	getObject: () => {
		return Promise.resolve({
			creator: 'user2'
		});
	}
};

const onBefore = () => {
	jest.useFakeTimers();
	setupTestClient(mockService);
};

const onAfter = () => {
	tearDownTestClient();
};

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/* eslint-env jest */
describe('Note Details', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	test('General: (Liked, Favorited, Tim Jones, A Day Ago)', async () => {
		const item = {
			body: ['This is the body.'],
			isReply: () => false,
			title: 'Note Title',
			creator: 'User',
			getCreatedTime: () => new Date() - (1000 * 60 * 60 * 24),
			isTopLevel: () => true,
			LikeCount: 1,
			Links: ['unlike','unfavorite'],
			hasLink: function (link) { return this.Links.includes(link); },
			MimeType: 'application/vnd.nextthought.note',
			containerId: 'tag:nextthought.com,2011-10:NTI-HTML-8211584329684854468',
			getContextData: () => Promise.resolve(),
			getID: () => 'tag:nextthought.com,2011-10:user2-OID-0x05819c:5573657273:aZT2yH3CDrT',
			inReplyTo: 'tag:nextthought.com,2011-10:user2-OID-0x05763d:5573657273:PRXB6WxX47U'
		};

		const noteDetail = renderer.create(<Detail item={item} />);

		jest.runAllTimers();
		await flushPromises();

		const tree = noteDetail.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('General: (Tim Jones, A 2 Days Ago)', async () => {
		const item = {
			body: ['This is the body.'],
			isReply: () => false,
			title: 'Note Title',
			creator: 'User',
			getCreatedTime: () => new Date() - (1000 * 60 * 60 * 48),
			isTopLevel: () => true,
			LikeCount: 0,
			Links: [],
			hasLink: function (link) { return this.Links.includes(link); },
			MimeType: 'application/vnd.nextthought.note',
			containerId: 'tag:nextthought.com,2011-10:NTI-HTML-8211584329684854468',
			getContextData: () => Promise.resolve(),
			getID: () => 'tag:nextthought.com,2011-10:user2-OID-0x05819c:5573657273:aZT2yH3CDrT'
		};

		const noteDetail = renderer.create(<Detail item={item} />);

		jest.runAllTimers();
		await flushPromises();

		const tree = noteDetail.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Reply', async () => {
		const item = {
			body: ['This is the body.'],
			isReply: () => true,
			title: 'Note Title',
			creator: 'User',
			getCreatedTime: () => new Date() - (1000 * 60 * 60 * 48),
			isTopLevel: () => true,
			LikeCount: 0,
			Links: [],
			hasLink: function (link) { return this.Links.includes(link); },
			MimeType: 'application/vnd.nextthought.note',
			containerId: 'tag:nextthought.com,2011-10:NTI-HTML-8211584329684854468',
			getContextData: () => Promise.resolve(),
			getID: () => 'tag:nextthought.com,2011-10:user2-OID-0x05819c:5573657273:aZT2yH3CDrT'
		};

		const noteDetail = renderer.create(<Detail item={item} />);

		jest.runAllTimers();
		await flushPromises();

		const tree = noteDetail.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
