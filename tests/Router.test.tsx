import { screen } from '@testing-library/react';

import { describe } from 'vitest';
import { navigateTo } from './utils';

describe('Router', () => {
	test.each([
		{
			scenario: 'home',
			title: /home/i,
			path: '/',
		},
		{
			scenario: 'products',
			title: /products/i,
			path: '/products',
		},
	])('should render the $scenario page for $path', ({ title, path }) => {
		navigateTo(path);

		expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
	});
});
