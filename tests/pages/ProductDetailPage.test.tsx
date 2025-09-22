import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, test } from 'vitest';
import { Product } from '../../src/entities';
import { db } from '../mocks/db';
import { navigateTo } from '../utils';

describe('ProductDetailPage', () => {
	let product: Product = { id: 0, name: '', price: 0, categoryId: 0 };

	beforeAll(() => {
		product = db.product.create();
	});

	afterAll(() => {
		db.product.delete({ where: { id: { equals: product.id } } });
	});

	test('should loading', () => {
		navigateTo('/products/' + product.id);

		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	test('should render product details', async () => {
		navigateTo('/products/' + product.id);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		expect(
			screen.getByRole('heading', { name: product.name })
		).toBeInTheDocument();
		expect(screen.getByText('$' + product.price)).toBeInTheDocument();
	});
});
