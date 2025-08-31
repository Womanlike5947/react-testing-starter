import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
// import { products } from '../mocks/data';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { db } from '../mocks/db';

describe('ProductDetail', () => {
	// type Product = { id: number; name: string; price: number };
	// const products: Product[] = [];

	let productId: number;

	beforeAll(() => {
		const product = db.product.create();
		productId = product.id;
	});

	afterAll(() => {
		db.product.delete({ where: { id: { equals: productId } } });
	});

	test('should render the product details', async () => {
		const product = db.product.findFirst({
			where: { id: { equals: productId } },
		});
		server.use(http.get('/products/1', () => HttpResponse.json(product)));

		render(<ProductDetail productId={productId} />);

		expect(
			await screen.findByText(new RegExp(product!.name.toString()))
		).toBeInTheDocument();

		expect(
			await screen.findByText(new RegExp(product!.price.toString()))
		).toBeInTheDocument();
	});

	test('should render message if product not found', async () => {
		server.use(http.get('/products/1', () => HttpResponse.json(null)));

		render(<ProductDetail productId={1} />);

		const message = await screen.findByText(/not found/i);
		expect(message).toBeInTheDocument();
	});

	test('should render an error for invalid id', async () => {
		render(<ProductDetail productId={0} />);

		const error = await screen.findByText(/invalid/i);
		expect(error).toBeInTheDocument();
	});
});
