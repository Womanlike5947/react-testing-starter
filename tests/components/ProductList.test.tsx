import { test, expect, describe } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from 'msw';
import { db } from '../mocks/db';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('ProductList', () => {
	const productIds: number[] = [];

	beforeAll(() => {
		[1, 2, 3].forEach(() => {
			const product = db.product.create();
			productIds.push(product.id);
		});
	});

	afterAll(() => {
		db.product.deleteMany({ where: { id: { in: productIds } } });
	});

	const renderComponent = () => {
		const client = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		render(
			<QueryClientProvider client={client}>
				<ProductList />
			</QueryClientProvider>
		);
	};

	test('should render the list of products', async () => {
		renderComponent();
		const items = await screen.findAllByRole('listitem');
		expect(items.length).toBeGreaterThan(0);
	});

	test('should render no products available if no product is found', async () => {
		// Override the http get handler by passing through an empty array
		server.use(http.get('/products', () => HttpResponse.json([])));
		renderComponent();

		const message = await screen.findByText(/no products/i);

		expect(message).toBeInTheDocument();
	});

	test('should render an error message when there is an error', async () => {
		server.use(http.get('/products', () => HttpResponse.error()));
		renderComponent();

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	test('should render a loading indicator when fetching data', async () => {
		server.use(
			http.get('/products', async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		renderComponent();
		// Await something to ensure the test is async, e.g. wait for loading indicator
		expect(await screen.findByText(/loading/i)).toBeInTheDocument();
	});

	test('should remove the loading indicator after data is fetched', async () => {
		renderComponent();
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	test('should remove the loading indicator if data fetching fails', async () => {
		server.use(http.get('/products', () => HttpResponse.error()));

		renderComponent();
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});
});
