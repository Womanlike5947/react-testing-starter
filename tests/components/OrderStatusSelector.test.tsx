import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
	const renderComponent = () => {
		render(
			<Theme>
				<OrderStatusSelector onChange={vi.fn()} />
			</Theme>
		);

		return {
			trigger: screen.getByRole('combobox'),
			getOptions: () => screen.findAllByRole('option'),
		};
	};

	test('should render New as the default value', async () => {
		const { trigger } = renderComponent();
		expect(trigger).toHaveTextContent(/new/i);
	});

	test('should render correct statuses', async () => {
		const { trigger, getOptions } = renderComponent();
		const user = userEvent.setup();

		await user.click(trigger);

		const options = await getOptions();
		const labels = options.map((option) => option.textContent);

		expect(options).toHaveLength(3);
		expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
	});
});
