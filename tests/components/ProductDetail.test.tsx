import { test, expect, describe } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductDetail from '../../src/components/ProductDetail';
import { http, HttpResponse, delay } from 'msw';
import { server } from '../mocks/server';
import { db } from '../mocks/db';

describe('ProductDetail', () => {
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

	test('should render an error message when there is an error', async () => {
		server.use(http.get('/products/1', () => HttpResponse.error()));
		render(<ProductDetail productId={1} />);

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	test('should render a loading indicator when fetching data', async () => {
		server.use(
			http.get('/products/1', async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		render(<ProductDetail productId={1} />);

		// Await something to ensure the test is async, e.g. wait for loading indicator
		expect(await screen.findByText(/loading/i)).toBeInTheDocument();
	});

	test('should remove the loading indicator after data is fetched', async () => {
		render(<ProductDetail productId={1} />);

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	test('should remove the loading indicator if data fetching fails', async () => {
		server.use(http.get('/products/1', () => HttpResponse.error()));

		render(<ProductDetail productId={1} />);

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});
});
