import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { db } from '../mocks/db';
import { Category, Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
	const categories: Category[] = [];
	const products: Product[] = [];

	beforeAll(() => {
		[1, 2].forEach((item) => {
			categories.push(db.category.create({ name: 'Category' + item }));
		});

		[1, 2].forEach(() => {
			products.push(db.product.create());
		});
	});

	afterAll(() => {
		const categoryIds = categories.map((c) => c.id);
		db.category.deleteMany({ where: { id: { in: categoryIds } } });

		const productIds = products.map((p) => p.id);
		db.product.deleteMany({ where: { id: { in: productIds } } });
	});

	const renderComponent = () => {
		render(
			<CartProvider>
				<Theme>
					<BrowseProducts />
				</Theme>
			</CartProvider>
		);

		return {
			getProductsSkeleton: () =>
				screen.queryByRole('progressbar', { name: /products/i }),
			getCategoriesSkeleton: () =>
				screen.queryByRole('progressbar', { name: /categories/i }),
			getCategoriesCombobox: () => screen.queryByRole('combobox'),
		};
	};

	test('should show a loading skeleton when fetching categories', () => {
		simulateDelay('/categories');

		const { getCategoriesSkeleton } = renderComponent();

		expect(getCategoriesSkeleton()).toBeInTheDocument();
	});

	test('should hide the loading skeleton after categories are fetched', async () => {
		const { getCategoriesSkeleton } = renderComponent();

		await waitForElementToBeRemoved(getCategoriesSkeleton);
	});

	test('should show a loading skeleton when fetching products', () => {
		simulateDelay('/products');

		const { getProductsSkeleton } = renderComponent();

		expect(getProductsSkeleton()).toBeInTheDocument();
	});

	test('should hide the loading skeleton after products are fetched', async () => {
		const { getProductsSkeleton } = renderComponent();

		await waitForElementToBeRemoved(getProductsSkeleton);
	});

	test('should not render an error if categories cannot be fetched', () => {
		simulateError('/categories');

		const { getCategoriesCombobox } = renderComponent();

		expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

		expect(getCategoriesCombobox()).not.toBeInTheDocument();
	});

	test('should render an error if products cannot be fetched', async () => {
		simulateError('/products');

		renderComponent();

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	test('should render categories', async () => {
		const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

		await waitForElementToBeRemoved(getCategoriesSkeleton);

		const combobox = getCategoriesCombobox();
		expect(combobox).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(combobox!);
		// 👆🏼 combobox errors because 'queryByRole' could return a null value but we know there is a combobox, so putting ! at the end states it will be there

		expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

		categories.forEach((category) => {
			expect(
				screen.getByRole('option', { name: category.name })
			).toBeInTheDocument();
		});
	});

	test('should render products', async () => {
		const { getProductsSkeleton } = renderComponent();

		await waitForElementToBeRemoved(getProductsSkeleton);

		products.forEach((product) => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
		});
	});
});
