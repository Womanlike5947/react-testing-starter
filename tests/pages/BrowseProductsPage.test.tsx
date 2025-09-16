import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { db, getProductsByCategory } from '../mocks/db';
import { Category, Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
	const categories: Category[] = [];
	const products: Product[] = [];

	beforeAll(() => {
		[1, 2].forEach(() => {
			const category = db.category.create();
			categories.push(category);
			// Create two products for each category
			[1, 2].forEach(() => {
				products.push(db.product.create({ categoryId: category.id }));
			});
		});

		// [1, 2].forEach(() => {
		// });
	});

	afterAll(() => {
		const categoryIds = categories.map((c) => c.id);
		db.category.deleteMany({ where: { id: { in: categoryIds } } });

		const productIds = products.map((p) => p.id);
		db.product.deleteMany({ where: { id: { in: productIds } } });
	});

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
		const { getCategoriesSkeleton, getCategoriesCombobox, user } =
			renderComponent();

		await waitForElementToBeRemoved(getCategoriesSkeleton);

		const combobox = getCategoriesCombobox();
		expect(combobox).toBeInTheDocument();

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

	test('should render products by category', async () => {
		const { selectCategory, expectProductToBeInTheDocument } = renderComponent();

		const selectedCategory = categories[0];
		await selectCategory(selectedCategory.name);

		const products = getProductsByCategory(selectedCategory.id);
		expectProductToBeInTheDocument(products);
	});

	test('should render all products if All category is selected', async () => {
		const { selectCategory, expectProductToBeInTheDocument } = renderComponent();

		await selectCategory(/all/i);

		const products = db.product.getAll();
		expectProductToBeInTheDocument(products);
	});
});

const renderComponent = () => {
	render(
		<CartProvider>
			<Theme>
				<BrowseProducts />
			</Theme>
		</CartProvider>
	);

	// All of these have been moved into renderComponent so they usable to each other.
	const user = userEvent.setup();

	const getProductsSkeleton = () =>
		screen.queryByRole('progressbar', { name: /products/i });

	const getCategoriesSkeleton = () =>
		screen.queryByRole('progressbar', { name: /categories/i });

	const getCategoriesCombobox = () => screen.queryByRole('combobox');

	// Take this out of the test filters as these are repeated functions
	const selectCategory = async (name: RegExp | string) => {
		await waitForElementToBeRemoved(getCategoriesSkeleton);
		const combobox = getCategoriesCombobox();
		await user.click(combobox!);

		const option = screen.queryByRole('option', {
			name: name,
		});
		await user.click(option!);
	};

	const expectProductToBeInTheDocument = (products: Product[]) => {
		const rows = screen.queryAllByRole('row');
		const dataRows = rows.slice(1);
		expect(dataRows).toHaveLength(products.length);
		products.forEach((product) => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
		});
	};

	return {
		user,
		getProductsSkeleton,
		getCategoriesSkeleton,
		getCategoriesCombobox,
		selectCategory,
		expectProductToBeInTheDocument,
	};
};
