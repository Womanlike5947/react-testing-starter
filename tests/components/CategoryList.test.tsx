import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { describe, test } from 'vitest';
import CategoryList from '../../src/components/CategoryList';
import { Category } from '../../src/entities';
import ReduxProvider from '../../src/providers/ReduxProvider';
import { db } from '../mocks/db';
import { simulateError } from '../utils';

describe('CategoryList', () => {
	const categories: Category[] = [];

	beforeAll(() => {
		[1, 2].forEach(() => {
			const category = db.category.create();
			categories.push(category);
		});
	});

	afterAll(() => {
		const categoryIds = categories.map((c) => c.id);
		db.category.deleteMany({ where: { id: { in: categoryIds } } });
	});

	const renderComponent = () => {
		render(
			<ReduxProvider>
				<CategoryList />
			</ReduxProvider>
		);

		return {
			loading: screen.queryByText(/loading/i),
		};
	};

	test('should render a list of categories', async () => {
		const { loading } = renderComponent();

		await waitForElementToBeRemoved(loading);

		categories.forEach((category) => {
			expect(screen.getByText(category.name)).toBeInTheDocument();
		});
	});

	test('should render loading state', () => {
		const { loading } = renderComponent();

		expect(loading).toBeInTheDocument();
	});

	test('should render an error state', async () => {
		simulateError('/categories');
		renderComponent();

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});
});
