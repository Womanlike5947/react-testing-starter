import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import ProductForm from '../src/components/ProductForm';
import { Category, Product } from '../src/entities';
import AllProviders from './AllProviders';
import { db } from './mocks/db';

describe('ProductForm', () => {
	let category: Category;
	let product: Product;

	beforeAll(() => {
		category = db.category.create();
		product = db.product.create({ categoryId: category.id });
	});

	afterAll(() => {
		db.category.delete({ where: { id: { equals: category.id } } });
		db.product.delete({ where: { id: { equals: product.id } } });
	});

	test('should render form fields', async () => {
		const { getInputs, waitForFormToLoad } = renderComponent();

		// INFO could also use: await screen.findByRole('form');)
		await waitForFormToLoad();

		const inputs = getInputs();

		expect(inputs.nameInput).toBeInTheDocument();
		expect(inputs.priceInput).toBeInTheDocument();

		expect(inputs.categoryInput).toBeInTheDocument();
	});

	test('should populate form fields when editing a product', async () => {
		const { getInputs, waitForFormToLoad } = renderComponent(product);

		await waitForFormToLoad();

		const { nameInput, priceInput, categoryInput } = getInputs();

		expect(nameInput).toHaveValue(product.name);
		expect(priceInput).toHaveValue(product.price.toString());
		expect(categoryInput).toHaveTextContent(category.name);
	});
});

const renderComponent = (product?: Product) => {
	render(<ProductForm product={product} onSubmit={vi.fn()} />, {
		wrapper: AllProviders,
	});

	return {
		getInputs: () => {
			return {
				nameInput: screen.getByPlaceholderText(/name/i),
				priceInput: screen.getByPlaceholderText(/price/i),
				categoryInput: screen.getByRole('combobox', { name: /category/i }),
			};
		},
		waitForFormToLoad: () => screen.findByRole('form'),
	};
};
