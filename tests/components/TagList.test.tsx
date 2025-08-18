import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
	test('should render tags', async () => {
		render(<TagList />);

		// 👇🏼 This waitFor keeps calling the callback until it times out
		// await waitFor(() => {
		// 	const listItem = screen.getAllByRole('listitem');
		// 	expect(listItem.length).toBeGreaterThan(0);
		// });

		const list = await screen.findAllByRole('listitem');
		expect(list.length).toBeGreaterThan(0);
	});
});
