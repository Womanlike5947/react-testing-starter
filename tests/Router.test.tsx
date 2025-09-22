import { screen } from '@testing-library/react';
import { describe } from 'vitest';
import { db } from './mocks/db';
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

	test('should render the product details page for /products/:id', async () => {
		const product = db.product.create();
		navigateTo(`/products/${product.id}`);
		expect(await screen.findByText(product.name)).toBeInTheDocument();

		db.product.delete({ where: { id: { equals: product.id } } });
	});

	test('should render not found page for invalid routes', () => {
		navigateTo('/invalid-route');
		expect(screen.getByText(/not found/i)).toBeInTheDocument();
	});

	test('should render the admin home page for /admin', () => {
		navigateTo('/admin');
		expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();
	});
});
