import React from 'react';
import { mount } from 'enzyme';

import Publish from '../Publish';

const wait = n => new Promise(t => setTimeout(t, n));

/* eslint-env jest */
describe('Publish', () => {
	const contentPackage = {
		hasLink: () => { return true; },
		getAssociations: () => { return Promise.resolve([]); },
		addListener: () => {},
		removeListener: () => {},
	};

	test('Publish is enabled', async () => {
		let cmp = mount(<Publish contentPackage={contentPackage}/>);

		await wait(100);

		cmp.update();

		let el = cmp.find('.content-editor-publish-trigger');

		expect(el.hasClass('disabled')).toBe(false);
	});

	test('Publish is disabled', async () => {
		let cmp = mount(<Publish contentPackage={contentPackage} disabled/>);

		await wait(100);
		cmp.update();

		let el = cmp.find('.content-editor-publish-trigger');

		expect(el.hasClass('disabled')).toBe(true);
	});
});
