import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe } from 'vitest';
import routes from '../src/routes';

describe('Router', () => {
	test('should render the home page for /', () => {
		// This simulated the actual routes because routes can only be used in a browser component
		const router = createMemoryRouter(routes, { initialEntries: ['/'] });

		render(<RouterProvider router={router} />);

		expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
	});

	test('should render the products page for products', () => {
		// This simulated the actual routes because routes can only be used in a browser component
		const router = createMemoryRouter(routes, { initialEntries: ['/products'] });

		render(<RouterProvider router={router} />);

		expect(
			screen.getByRole('heading', { name: /products/i })
		).toBeInTheDocument();
	});
});
