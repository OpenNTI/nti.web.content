import React from 'react';
import renderer from 'react-test-renderer';

import ThoughtPrompt from '../ThoughtPrompt';

/* eslint-env jest */
describe('Thought Prompt', () => {
	test('Simple', () => {
		const tree = renderer.create(<ThoughtPrompt />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
