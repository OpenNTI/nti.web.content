import React from 'react';
import { mount } from 'enzyme';

import Publish from '../Publish';

/* eslint-env jest */
describe('Publish', () => {
	const contentPackage = {
		hasLink: () => { return true; },
		getAssociations: () => { return Promise.resolve([]); },
		addListener: () => {},
		removeListener: () => {},
	};

	test('Publish is enabled', () => {
		let cmp = mount(<Publish contentPackage={contentPackage}/>);

		expect(cmp.hasClass('disabled')).toBe(false);
	});

	test('Publish is disabled', () => {
		let cmp = mount(<Publish contentPackage={contentPackage} disabled/>);

		expect(cmp.hasClass('disabled')).toBe(true);
	});
});
