import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductList', () => {
	test('should render the list of products', async () => {
		render(<ProductList />);
		const items = await screen.findAllByRole('listitem');
		expect(items.length).toBeGreaterThan(0);
	});

	test('should render no products available if no product is found', async () => {
		// Override the http get handler by passing through an empty array
		server.use(http.get('/products', () => HttpResponse.json([])));
		render(<ProductList />);

		const message = await screen.findByText(/no products/i);

		expect(message).toBeInTheDocument();
	});
});
