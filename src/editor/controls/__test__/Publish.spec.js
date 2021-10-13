import { render, waitFor } from '@testing-library/react';

import Publish from '../Publish';

/* eslint-env jest */
describe('Publish', () => {
	const contentPackage = {
		hasLink: () => {
			return true;
		},
		getAssociations: () => {
			return Promise.resolve([]);
		},
		addListener: () => {},
		removeListener: () => {},
	};

	test('Publish is enabled', async () => {
		const result = render(<Publish contentPackage={contentPackage} />);

		return waitFor(() => {
			const el = result.container.querySelector(
				'.content-editor-publish-trigger'
			);

			expect(el.classList.contains('disabled')).toBe(false);
		});
	});

	test('Publish is disabled', async () => {
		const result = render(
			<Publish contentPackage={contentPackage} disabled />
		);

		return waitFor(() => {
			const el = result.container.querySelector(
				'.content-editor-publish-trigger'
			);

			expect(el.classList.contains('disabled')).toBe(true);
		});
	});
});
