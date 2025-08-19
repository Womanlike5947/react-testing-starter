import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

describe('OrderStatusSelector', () => {
	const renderComponent = () => {
		const onChange = vi.fn();
		render(
			<Theme>
				<OrderStatusSelector onChange={onChange} />
			</Theme>
		);

		return {
			trigger: screen.getByRole('combobox'),

			getOptions: () => screen.findAllByRole('option'),
			getOption: (label: RegExp) => screen.findByRole('option', { name: label }),
			user: userEvent.setup(),
			onChange,
		};
	};

	test('should render New as the default value', async () => {
		const { trigger } = renderComponent();
		expect(trigger).toHaveTextContent(/new/i);
	});

	test('should render correct statuses', async () => {
		const { trigger, getOptions, user } = renderComponent();

		await user.click(trigger);

		const options = await getOptions();
		const labels = options.map((option) => option.textContent);

		expect(options).toHaveLength(3);
		expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
	});

	describe('Walk through', () => {
		test.each([
			{ label: /processed/i, value: 'processed' },
			{ label: /fulfilled/i, value: 'fulfilled' },
			{ label: /processed/i, value: 'processed' },
		])(
			'should call onChange with $value when the $label option is selected',
			async ({ label, value }) => {
				const { trigger, getOption, user, onChange } = renderComponent();
				await user.click(trigger);

				const option = await getOption(label);
				await user.click(option);

				expect(onChange).toHaveBeenCalledWith(value);
			}
		);

		test("should call onChange with 'new' when the New option is selected", async () => {
			const { trigger, user, getOption, onChange } = renderComponent();
			await user.click(trigger);

			const prosessedOption = await getOption(/processed/i);

			await user.click(prosessedOption);
			await user.click(trigger);

			const newOption = await getOption(/new/i);

			await user.click(newOption);

			expect(onChange).toHaveBeenCalledWith('new');
		});
	});
});
